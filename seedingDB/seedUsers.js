const mongoose = require('mongoose');
const User = require('../models/user');

/*
* 
* This javascript file seeds data into the database using the tutors and 
* seedHelper files
*
*
*/

// This function searches for a random element in an array
const sample = (arry) => array[Math.floor(Math.random() * array.length)];

const seedUsers = async() => {
    await User.deleteMany({}); // Waits to clear existing users
}

// Loops 50 times to put 50 different elements of data into our database
for(let i = 0; i < 50; i++) {
    
}

const emailSuffix = '@fakeUWF.com';
const users = [];
