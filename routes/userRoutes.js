const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const isAuthenticated = require('../middleware/auth');
const userController = require('../controllers/userController');

// Route for profile page
router.get('/profile', isAuthenticated, userController.getProfile);

// Route for  GET request for login page
router.get('/login', userController.getLogin);

// Route for POST request for login page
router.post('/login', userController.postLogin);

// Route for POST request for logout page
router.post('/logout', userController.postLogout);

module.exports = router;