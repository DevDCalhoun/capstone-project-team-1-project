const bcrypt = require('bcrypt');
const User = require('../models/user');
const Appointment = require('../models/appointment.js');
const { profileErrors, loginHandler } = require('../middleware/userErrorHandler.js');

// Error handling and route logic for the user profile route
exports.getProfile = async (req, res, next) => {
  try {
    // Finds user in database but does not look at the password field
    const user = await User.findById(req.session.userId).select('-password');

    // Find all appointments where the user is the student
    const appointments = await Appointment.find({ studentId: req.session.userId })
      .populate('tutorId') // Populate the tutor details
      .sort({ date: -1 }); // Sort appointments by date in descending order

    // Render user profile with 'user' and 'appointments' entries from database
    res.render('userProfile', { user, appointments });
  } catch (error) {
    console.error("Profile error: ", error);
    res.status(500).send('Internal server error');
  }
}

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