const mongoose = require('mongoose');

const availabilitySchema = new Schema({
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
  }
})

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;