const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // shortcut to mongoose


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
        type: [String], // Array of strings for storing review texts
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
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
