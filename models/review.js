const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,  // FALSE for SEEDING
    },
    content: {
        type: String, 
    },
    reviewerName: {
        type: String,
    },
    reviewerID: {
        type: mongoose.Schema.Types.ObjectId, // References the student's ID
        ref: 'User', 
        required: false // Ensures each review has an associated student ID FALSE for SEEDING
    },
    rating: {
        type: Number,
        required: false,
        min: 0,
        max: 5
    }
});

module.exports = reviewSchema;