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

      // Check if the selected date and time are in the future
      const selectedDateTime = new Date(`${date}T${time}`);
      const currentDateTime = new Date();

      if (selectedDateTime <= currentDateTime) {
        return res.status(400).send('Appointment data and time must be in the future.');
      }

      // Find the tutor by ID to ensure they exist
      const tutor = await User.findById(tutorId);
      if (!tutor || !tutor.isTutor) {
          return res.status(404).send('Tutor not found');
      }

      // Prevent tutors from booking themselves
      if (studentId === tutorId) {
        return res.status(400).send('You cannot make an appointment with yourself');
      }

      // Create a new appointment
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