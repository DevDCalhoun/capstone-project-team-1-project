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
const flash = require('connect-flash');
const { param } = require('express-validator');
const profileController = require('../controllers/profileController');


// Route for profile page
router.get('/profile', isAuthenticated, userController.getProfile);

// Route for  GET request for login page
router.get('/login', userController.getLogin);

// Route for POST request for login page
router.post('/login', userController.postLogin);

// Route for POST request for logout page
router.post('/logout', userController.postLogout);

router.get('/availability', isAuthenticated, (req, res) => {
  if(!req.session.userId) {
    return res.redirect('/user/login');
  }

  res.render('availability', { userId: req.session.userId }); 
})

router.post('/availability', isAuthenticated, async (req, res) => {
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
    const studentId = req.session.userId;
    const userRole = req.session.userRole;

    const selectedDateTime = new Date(`${date}T${time}`);

    // Check if selected date and time is in the future
    const currentDateTime = new Date();
    if (selectedDateTime <= currentDateTime) {
      return res.status(400).send('Appointment date and time must be in the future.');
    }

    // Find the tutor and check availability
    const tutor = await User.findById(tutorId).populate('availability');
    if (!tutor || !tutor.isTutor) {
      return res.status(404).send('Tutor not found');
    }

    // Prevent tutors from booking themselves
    if (studentId === tutorId) {
      return res.status(400).send('You cannot make an appointment with yourself.');
    }

    // Validate the selected time falls within the tutor's available hours for that day
    const appointmentDay = selectedDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const availabilityForDay = tutor.availability.find(avail => avail.day === appointmentDay);
    if (!availabilityForDay) {
      return res.status(400).send(`The tutor is not available on ${appointmentDay}.`);
    }

    const [startHour, startMinute] = availabilityForDay.startTime.split(':');
    const [endHour, endMinute] = availabilityForDay.endTime.split(':');

    const availabilityStartTime = new Date(selectedDateTime);
    availabilityStartTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

    const availabilityEndTime = new Date(selectedDateTime);
    availabilityEndTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    if (selectedDateTime < availabilityStartTime || selectedDateTime >= availabilityEndTime) {
      return res.status(400).send('Selected time is outside the available hours.');
    }

    // Check for overlapping appointments by the same start time
    const overlappingAppointments = await Appointment.findOne({
      tutorId,
      day: date,
      time
    });

    if (overlappingAppointments) {
      return res.status(400).send('The tutor is already booked for this time slot.');
    }

    // Create the appointment
    const appointmentManager = new AppointmentManager(studentId, userRole);
    const newAppointment = await appointmentManager.createAppointment(
      studentId,
      tutorId,
      date,
      time,
      details || 'General Inquiry'
    );

    await newAppointment.save();

    if (newAppointment) {
      logger.notice('New tutoring appointment created.');
    }

    res.redirect('/user/profile');
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).send('Server error');
  }
});

router.post('/:id/accept', 
  [
    param('id').isMongoId().withMessage('Invalid appointment ID.')
  ],
  userController.acceptAppointment
);

router.post('/:id/reject', 
  [
    param('id').isMongoId().withMessage('Invalid appointment ID.')
  ],
  userController.rejectAppointment
);


router.post('/:id/complete', userController.completeAppointment);

router.get('/:id/review', isAuthenticated, userController.getReviewPage);

router.post('/:id/review', isAuthenticated, userController.submitReview);

router.get('/:id', profileController.getProfile);

module.exports = router;