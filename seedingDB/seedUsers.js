const mongoose = require('mongoose');
const User = require('../models/user');
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

    // Loops 100 times to put 50 different elements of data into our database
    for(let i = 0; i < 50; i++) {
        const random100 = Math.floor(Math.random() * 100); // generates a random number up to 100
        const seedUsername = sample(seedUsernames) + random100;
        const seedEmail = seedUsername + emailSuffix;
        const defaultPassword = '12345678';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const user = new User({
            username: seedUsername,
            email: seedEmail,
            password: hashedPassword,
            major: `${sample(major)}`,
            rating:Math.floor(Math.random() * 6), // generates a rating between 0 and 5
            reviews: ['A review of the user', 'Another review2 of the user'],
            schoolYear: `${sample(schoolYear)}`,
            isTutor: Math.floor(Math.random() * 2)
        })
        await user.save();
    }
}
seedUsers();


