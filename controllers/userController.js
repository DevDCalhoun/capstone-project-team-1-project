const bcrypt = require('bcrypt');
const User = require('../models/user');
const Appointment = require('../models/appointment.js');
const { profileErrors, loginHandler } = require('../middleware/userErrorHandler.js');
const { validationResult } = require('express-validator');
const AppointmentManager = require('../classes/appointmentManager');


exports.getProfile = async (req, res, next) => {
  try {
    // Fetch the user from the database, excluding the password
    const user = await User.findById(req.session.userId).select('-password');

    if (!user) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/login'); // Redirect to login or appropriate page
    }

    // Fetch appointments where the user is the student
    const studentAppointments = await Appointment.find({ studentId: req.session.userId })
      .populate('tutorId', 'username email') // Populate tutor details
      .sort({ day: -1 }); // Sort appointments by date in descending order

    // Fetch appointments where the user is the tutor
    const tutorAppointments = await Appointment.find({ tutorId: req.session.userId })
      .populate('studentId', 'username email') // Populate student details
      .sort({ day: -1 }); // Sort appointments by date in descending order

    // Render the profile page with user info and both sets of appointments
    res.render('userProfile', { user, studentAppointments, tutorAppointments });
  } catch (error) {
    console.error("Profile error: ", error);
    req.flash('error_msg', 'Internal server error.');
    res.status(500).redirect('/profile'); // Redirect back to profile or error page
  }
};

// Route logic for user login page
exports.getLogin = (req, res) => {
  res.render('login');
}

// Error handling and route logic for the user login route
exports.postLogin = async (req, res, next) => {
  const {username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    loginHandler(req, res, user); // error checking and session logic from userErrorHandler.js
  } catch (error) {
    console.error('Login error: ', error);
    res.status(500).render('login', {error: 'An error occured. Please try again later.'});
  }
}

// Logs the user out and ends the session
exports.postLogout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send('Internal Server Error');
    }

  })

  res.clearCookie('session');

  res.redirect('/user/login');
};

exports.acceptAppointment = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error_msg', errors.array().map(err => err.msg).join(' '));
    return res.redirect('/appointments/profile');
  }

  try {
    const appointmentId = req.params.id;
    const userId = req.session.userId;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      req.flash('error_msg', 'Appointment not found.');
      return res.redirect('/appointments/profile');
    }

    // **Authorization Check:** Ensure the current user is the tutor
    if (appointment.tutorId.toString() !== userId) {
      req.flash('error_msg', 'Unauthorized action.');
      return res.redirect('/appointments/profile');
    }

    // Check if the appointment is already confirmed or cancelled
    if (appointment.status !== 'Pending') {
      req.flash('error_msg', `Cannot accept an appointment that is already ${appointment.status}.`);
      return res.redirect('/appointments/profile');
    }

    // Update the appointment status to 'Confirmed'
    appointment.status = 'Confirmed';
    await appointment.save();

    req.flash('success_msg', 'Appointment accepted successfully.');
    res.redirect('/appointments/profile');
  } catch (error) {
    console.error("Accept Appointment Error: ", error);
    req.flash('error_msg', 'Internal server error.');
    res.redirect('/appointments/profile');
  }
};

exports.rejectAppointment = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error_msg', errors.array().map(err => err.msg).join(' '));
    return res.redirect('/appointments/profile');
  }

  try {
    const appointmentId = req.params.id;
    const userId = req.session.userId;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      req.flash('error_msg', 'Appointment not found.');
      return res.redirect('/appointments/profile');
    }

    // **Authorization Check:** Ensure the current user is the tutor
    if (appointment.tutorId.toString() !== userId) {
      req.flash('error_msg', 'Unauthorized action.');
      return res.redirect('/appointments/profile');
    }

    // Check if the appointment is already confirmed or cancelled
    if (appointment.status !== 'Pending') {
      req.flash('error_msg', `Cannot reject an appointment that is already ${appointment.status}.`);
      return res.redirect('/appointments/profile');
    }

    // Update the appointment status to 'Cancelled'
    appointment.status = 'Cancelled';
    await appointment.save();

    req.flash('success_msg', 'Appointment rejected successfully.');
    res.redirect('/appointments/profile');
  } catch (error) {
    console.error("Reject Appointment Error: ", error);
    req.flash('error_msg', 'Internal server error.');
    res.redirect('/appointments/profile');
  }
};

exports.completeAppointment = async (req, res) => {
  try {
    const userId = req.session.userId;
    const userRole = req.session.userRole; // Assuming userRole is stored in session

    // Instantiate AppointmentManager with userId and userRole
    const appointmentManager = new AppointmentManager(userId, userRole);

    const appointmentId = req.params.id;
    await appointmentManager.completeAppointment(appointmentId);

    req.flash('success_msg', 'Appointment marked as completed');
    res.redirect('/user/profile');
  } catch (error) {
    req.flash('error_msg', error.message);
    res.redirect('/user/profile');
  }
};
