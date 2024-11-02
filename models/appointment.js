const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: Date,
    required: true,
  },
  // Start time
  time: {
    type: String,
    required: false,
  },
  // End time
  endTime: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
})

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;