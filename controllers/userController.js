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

      for (let appointment of studentAppointments) {
        // Fetch the tutor and their reviews
        const tutor = await User.findById(appointment.tutorId._id).select('reviews');
        const reviews = tutor.reviews || [];
        
        // Check if the logged-in user's username matches any review's username
        appointment.existingReview = reviews.some(
          (review) => review.reviewerName === user.username
        );
      }

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

exports.getReviewPage = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId).populate('tutorId', 'username');

    if (!appointment || appointment.status !== 'Completed') {
      req.flash('error_msg', 'You can only review completed appointments.');
      res.redirect('/user/profile');
    }

    res.render('review', { appointmentId, tutorName: appointment.tutorId.username, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error("Error displaying review page:", error);
    req.flash('error_msg', 'Internal server error.');
    res.redirect('/user/profile');
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const appointmentId = req.params.id;
    const studentId = req.session.userId;

    const appointment = await Appointment.findById(appointmentId).populate('tutorId');
    if (!appointment || appointment.status !== 'Completed') {
      req.flash('error_msg', 'You can only review completed appointments.');
      return res.redirect('/user/profile');
    }

    const user = await User.findById(studentId).select('username');
    const review = {
      tutorId: appointment.tutorId._id,
      content,
      reviewerName: user.username,
      reviewerID: studentId,
      rating: parseInt(rating),
    };

    await User.findByIdAndUpdate(appointment.tutorId._id, { $push: { reviews: review } });

    const tutor = await User.findById(appointment.tutorId._id).select('reviews rating');
    tutor.rating = calculateAverageRating(tutor.reviews);
    await tutor.save();

    req.flash('success_msg', 'Review submitted successfully');
    res.redirect('/user/profile');
  } catch (error) {
    console.error("Error submitting review:", error);
    req.flash('error_msg', 'Internal server error.');
    res.redirect('/user/profile');
  }
};

exports.getEditReviewPage = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const studentId = req.session.userId;

    // Find the appointment and ensure it's completed
    const appointment = await Appointment.findById(appointmentId).populate('tutorId', 'username');
    if (!appointment || appointment.status !== 'Completed') {
      req.flash('error_msg', 'You can only edit reviews for completed appointments.');
      return res.redirect('/user/profile');
    }

    // Fetch the student and tutor information
    const user = await User.findById(studentId).select('username');
    const tutor = await User.findById(appointment.tutorId._id).select('reviews');

    // Find the existing review by the student's username
    const reviews = tutor.reviews || [];
    const existingReview = reviews.find((review) => review.reviewerName === user.username);

    if (!existingReview) {
      req.flash('error_msg', 'No existing review found to edit.');
      return res.redirect('/user/profile');
    }

    // Render the edit review page with the existing review data
    res.render('editReview', {
      appointmentId,
      tutorName: appointment.tutorId.username,
      review: existingReview, // Pass the review for pre-filling the form
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error('Error displaying edit review page:', error);
    req.flash('error_msg', 'Internal server error.');
    res.redirect('/user/profile');
  }
};

exports.submitEditedReview = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const appointmentId = req.params.id;
    const studentId = req.session.userId;

    // Find the appointment and ensure it's completed
    const appointment = await Appointment.findById(appointmentId).populate('tutorId');
    if (!appointment || appointment.status !== 'Completed') {
      req.flash('error_msg', 'You can only edit reviews for completed appointments.');
      return res.redirect('/user/profile');
    }

    // Fetch the student and tutor information
    const user = await User.findById(studentId).select('username');
    const tutor = await User.findById(appointment.tutorId._id).select('reviews');
    const reviews = tutor.reviews || [];

    // Use the same strategy to locate the existing review
    const review = reviews.find(
      (r) => r.reviewerName === user.username
    );

    if (!review) {
      req.flash('error_msg', 'Review not found.');
      return res.redirect('/user/profile');
    }

    // Update the review fields
    review.rating = parseInt(rating, 10);
    review.content = content;

    // Save the updated tutor document
    await tutor.save();

    req.flash('success_msg', 'Review updated successfully.');
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Error submitting edited review:', error);
    req.flash('error_msg', 'Internal server error.');
    res.redirect('/user/profile');
  }
};


// helper function to calculate new rating after a review is submitted for a tutor
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0; 
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};
