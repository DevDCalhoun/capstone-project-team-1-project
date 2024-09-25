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

module.exports = router;