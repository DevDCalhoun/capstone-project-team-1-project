const mongoose = require('mongoose');
const User = require('../models/user');
const availabilitySchema = require('../models/availability');
const {seedUsernames, major, schoolYear} = require('./seedHelper');
const bcrypt = require('bcryptjs');

/*
* 
* This javascript file seeds data into the database using the tutors and 
* seedHelper files
*
*
*/

// Connect to database
mongoose.connect('mongodb://localhost:27017/disruptutorDB');
// Mongoose connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: ")); // Runs if connection error
// event listener to db
db.once('open', () => {

});

// This function searches for a random element in an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedUsers = async() => {
    await User.deleteMany({}); // Waits to clear existing users

    const emailSuffix = '@fakeUWF.com';
    const defaultPassword = '12345678';
    const users = [];

    // Loops 100 times to put 100 random students and tutors into our database
    for(let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 100); // generates a random number up to 100
        const seedUsername = sample(seedUsernames) + random100;
        const seedEmail = seedUsername + emailSuffix;
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        users.push(new User({
            username: seedUsername,
            email: seedEmail,
            password: hashedPassword,
            major: `${sample(major)}`,
            rating:Math.floor(Math.random() * 6), // generates a rating between 0 and 5
            reviews: ['A review of the user', 'Another review2 of the user'],
            schoolYear: `${sample(schoolYear)}`,
            isTutor: Math.floor(Math.random() * 2)
        }));
    }

    await User.insertMany(users);   // Bulk insert all generated users
    console.log('User seeding completed.');

};


// Function to generate random availability (example: Monday-Sunday, 9AM-5PM slots)
const generateRandomAvailability = (tutorId) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const availability = [];
    days.forEach(day => {
        // Random start and end time between 9AM and 5PM
        const startHour = Math.floor(Math.random() * (17 - 9) + 9); // random hour between 9 and 5
        const endHour = startHour + Math.floor(Math.random() * 3) + 1; // random duration of 1-3 hours
        availability.push({
            tutorId: tutorId,   // Assigns tutorId to each availability entry
            day,
            startTime: `${startHour}:00`,
            endTime: `${endHour}:00`
        });
    });
    return availability;
};

const seedAvailability = async () => {
    try {
        // Fetch all tutors
        const tutors = await User.find({ isTutor: true });

        for (let tutor of tutors) {
            // Generate random availability schedule for each tutor
            const availability = generateRandomAvailability(tutor._id);

            // Update the tutor with generated availability
            tutor.availability = availability;

            // Save the updated tutor back to the database
            await tutor.save();
        }

        console.log('Availability seeding completed.');
    } catch (error) {
        console.error('Error seeding availability:', error);
    } 
};

// Main function to seed both users and availability in sequence
const seedAll = async () => {
    try {
        // Seed users (students and tutors)
        await seedUsers();

        // Seed availability for tutors
        await seedAvailability();
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        // Close the database connection once everything is seeded
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

// Run the full seeding process
seedAll();


