const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator'); // validationResult import
const logger = require('../logging/logger');
const User = require('../models/user');
const router = express.Router();

// Renders registration page and displays user form
router.get('/register', (req, res) => {
    res.render('register', { errors: [] });
});

// Handles user input and registration form submission
router.post('/register', [
    // Validation Checks
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password')
        .isLength({ min: 8, max: 12 }).withMessage('Password must be 8-12 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    body('major').optional().isString().withMessage('Major should be a valid string'),
    body('schoolYear').optional().isIn(['Freshman', 'Sophomore', 'Junior', 'Senior']).withMessage('Select a valid school year'),
    body('isTutor').optional().isBoolean().withMessage('Invalid tutor selection'),
], async (req, res) => {
    const { username, email, password, major, schoolYear, isTutor } = req.body;

    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Log detailed validation errors
            logger.error('Validation errors: ', { errors: errors.array() });
            return res.status(400).render('register', { errors: errors.array(), data: req.body });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.error('User already exists: ', { email });
            return res.status(400).render('register', { error: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,       
            email,          
            password: hashedPassword,
            major,          
            rating: 0,      
            reviews: [],    
            schoolYear,     
            isTutor: isTutor === 'true',
        });

        await newUser.save();

        // Log new user creation
        logger.notice('New user account created: ', { username, email });

        // Redirect to success or dashboard
        res.redirect('/user/profile');
    } catch (error) {
        // Log the error details including stack trace
        logger.error('Registration error: ', { error: error.message, stack: error.stack });
        res.status(500).render('register', { error: 'An internal server error occurred. Please try again later.' });
    }
});

module.exports = router;
