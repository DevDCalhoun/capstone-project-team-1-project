const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/auth');
const authorizeRole = require('../middleware/authRole');
const userController = require('../controllers/userController');
const AvailabilityManager = require('../classes/availabilityManager');
const AppointmentManager = require('../classes/appointmentManager');
const logger = require('../logging/logger');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const { addMinutes } = require('date-fns');

// Route for profile page
router.get('/profile', isAuthenticated, userController.getProfile);

// Route for  GET request for login page
router.get('/login', userController.getLogin);

// Route for POST request for login page
router.post('/login', userController.postLogin);

// Route for POST request for logout page
router.post('/logout', userController.postLogout);

router.get('/availability', isAuthenticated, authorizeRole('tutor'), (req, res) => {
  if(!req.session.userId) {
    return res.redirect('/user/login');
  }

  res.render('availability', { userId: req.session.userId }); 
})

router.post('/availability', isAuthenticated, authorizeRole('tutor'), async (req, res) => {
  const userId = req.session.userId;
  const availability = req.body.availability;

  const availabilityManager = new AvailabilityManager(userId);

  try {
    for (let day in availability) {
      if(availability[day].available === 'true') {
        const startTime = availability[day].startTime;
        const endTime = availability[day].endTime;
        await availabilityManager.updateAvailability(day, startTime, endTime);
      }
      else {
        // removeAvailability returns user
        await availabilityManager.removeAvailability(day);
      }
    }

    res.redirect('/user/profile');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

// GET route to display the appointment page (requires authentication)
router.get('/make-appointment', isAuthenticated, async (req, res) => {
  try {
      const { tutorId } = req.query;

      // Find the tutor by their tutorId and populate their availability
      const tutor = await User.findById(tutorId).populate('availability');
      if (!tutor || !tutor.isTutor) {
          return res.status(404).send('Tutor not found');
      }

      // Render the appointment making page, passing the tutor availability details
      res.render('make-appointment', { tutor });
  } catch(error) {
      console.error('Error loading appointment page: ', error);
      res.status(500).send('Server error');
  }
});

// POST route to create an appointment (requires authentication)
router.post('/make-appointment', isAuthenticated, authorizeRole('student', 'tutor', 'admin'), async (req, res) => {
  try {
      const { tutorId, date, time, details } = req.body;
      const studentId = req.session.userId;   // Get the logged-in student's ID from the session
      const userRole = req.session.userRole;  // Retrieve the user's role from the session

      // Covert times to Data object
      const selectedDateTime = new Date(`${date}T${time}`);
      const endTime = addMinutes(selectedDateTime, 30);   // Appointment end time (30 min time slots)

      // Check if time is valid and for future
      const currentDateTime = new Date();
      if (selectedDateTime <= currentDateTime) {
        return res.status(400).send('Appointment data and time must be in the future.');
      }

      // Find the tutor by ID and their availiability
      const tutor = await User.findById(tutorId).populate('availability');
      if (!tutor || !tutor.isTutor) {
          return res.status(404).send('Tutor not found');
      }

      // Prevent tutors from booking themselves
      if (studentId === tutorId) {
        return res.status(400).send('You cannot make an appointment with yourself');
      }

      // Get the day of the week for the selected date (e.g., "Monday")
      const appointmentDay = selectedDateTime.toLocaleString('en-US', { weekday: 'long' });

      // Find the tutor's availability for that day
      const availabilityForDay = tutor.availability.find(avail => avail.day === appointmentDay);
      if (!availabilityForDay) {
          return res.status(400).send(`The tutor is not available on ${appointmentDay}`);
      }

      // Convert the availability times to Date objects for comparison
      const [startHour, startMinute] = availabilityForDay.startTime.split(':');
      const [endHour, endMinute] = availabilityForDay.endTime.split(':');

      const availabilityStartTime = new Date(date);
      availabilityStartTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10));

      const availabilityEndTime = new Date(date);
      availabilityEndTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10));

      // Ensure the selected time is within the tutor's available hours
      if (selectedDateTime < availabilityStartTime || endTime > availabilityEndTime) {
          return res.status(400).send('Selected time is outside the tutor’s available hours');
      }

      // Check for overlapping appointments
      const overlappingAppointments = await Appointment.find({
        tutorId,
        day: date,
        $or: [
            { time: { $lt: endTime.toISOString(), $gte: selectedDateTime.toISOString() } },  // Overlap within the slot
            { endTime: { $gt: selectedDateTime.toISOString(), $lte: endTime.toISOString() } } // Overlap within the slot
        ]
    });

    if (overlappingAppointments.length > 0) {
        return res.status(400).send('The tutor is already booked for this time slot');
    }

      // Create a new appointment if no overlap
      const appointmentManager = new AppointmentManager(studentId, userRole);
      const newAppointment = await appointmentManager.createAppointment(
          studentId,
          tutorId,
          date,
          time,
          details || 'General Inquiry',   // If left blank
      );

      // Save the appointment to the database
      await newAppointment.save();

      // Log new appointment
      if (newAppointment) {
          logger.notice('New tutoring appointment created.');
      }

      //res.send('Appointment waiting confirmation from tutor.');
      // Redirect to a confirmation page or appointments list
      res.redirect('/user/profile'); // Redirect to profile page showing confirmed appointments
  } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).send('Server error');
  }
});

module.exports = router;