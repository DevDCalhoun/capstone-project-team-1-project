const mongoose = require('mongoose');
const Schema = mongoose.Schema; // shortcut to mongoose

const availabilitySchema = new Schema({

  tutorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the tutor
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  recurring: {
    type: Boolean,    // To indicate if this availability repeats weekly
    default: false    // Can default this to true
  }
})

module.exports = availabilitySchema;