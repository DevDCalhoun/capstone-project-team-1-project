const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // shortcut to mongoose
const availabilitySchema = require('./availability');
const reviewSchema = require('./review');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'tutor', 'admin'],    // Defined roles
        default: 'student'                      // Default role for all users
    },
    major: {
        type: String,
        required: false, // Optional, set to true if mandatory
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0, // 0 means not yet rated
    },
    reviews: {
        type: [reviewSchema], // Array of strings for storing review texts
        required: false,
    },
    schoolYear: {
        type: String,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
        required: false,
    },
    isTutor: {
        type: Boolean,
        default: false
    },
    availability: {
        type: [availabilitySchema],
        required: false,
    },
    appointmentsAsStudent: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment'
    }],
    appointmentAsTutor: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment' 
    }],
      coffeeLink: {
        type: String,
        required: false, // Optional field
    },
    platform: {
        type: String,
        enum: ['buymeacoffee', 'ko-fi', 'paypal'], // Add other platforms if needed
        required: false, // Optional field
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
