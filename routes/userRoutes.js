const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const isAuthenticated = require('../middleware/auth');
const userController = require('../controllers/userController');

// Route for profile page
router.get('/profile', isAuthenticated, userController.getProfile);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("There was an error logging you out: ", err);
      return res.status(500).send('Internal Server Error');
    }

  })

  res.clearCookie('session');

  res.redirect('/user/login');
})

module.exports = router;