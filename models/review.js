const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
        required: true // Ensures each review has an associated student ID
    }
});

module.exports = reviewSchema;