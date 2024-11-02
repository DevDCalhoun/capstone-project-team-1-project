const bcrypt = require('bcrypt');
const User = require('../models/user');
const Appointment = require('../models/appointment.js');
const { profileErrors, loginHandler } = require('../middleware/userErrorHandler.js');

exports.getProfile = async (req, res, next) => {
  try {
    // Fetch the user from the database, excluding the password
    const user = await User.findById(req.session.userId).select('-password');

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Fetch appointments where the user is the student
    const studentAppointments = await Appointment.find({ studentId: req.session.userId })
      .populate('tutorId', 'username email') // Populate tutor details
      .sort({ day: -1, time: -1 }); // Sort by date and time descending

    // Fetch appointments where the user is the tutor
    const tutorAppointments = await Appointment.find({ tutorId: req.session.userId })
      .populate('studentId', 'username email') // Populate student details
      .sort({ day: -1, time: -1 }); // Sort by date and time descending

    // Render the profile page with user info and both sets of appointments
    res.render('userProfile', { user, studentAppointments, tutorAppointments });
  } catch (error) {
    console.error("Profile error: ", error);
    res.status(500).send('Internal server error');
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