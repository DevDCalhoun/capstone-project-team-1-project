const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/auth');
const userController = require('../controllers/userController');
const AvailabilityManager = require('../classes/availabilityManager');

// Route for profile page
router.get('/profile', isAuthenticated, userController.getProfile);

// Route for  GET request for login page
router.get('/login', userController.getLogin);

// Route for POST request for login page
router.post('/login', userController.postLogin);

// Route for POST request for logout page
router.post('/logout', userController.postLogout);

router.get('/availability', (req, res) => {
  if(!req.session.userId) {
    return res.redirect('/user/login');
  }

  res.render('availability', { userId: req.session.userId }); 
})

router.post('/availability', async (req, res) => {
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
        await availabilityManager.removeAvailability(day);
      }
    }

    res.redirect('/user/profile');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

module.exports = router;