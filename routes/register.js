const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const router = express.Router();

// Renders registration page and displays user form
router.get('/register', (req, res) => {
    res.render('register');
});
// Handles user input and registration form submission
router.post('/register', [
   // Validation Checks
   body('username').notEmpty().withMessage('username is required'),
   body('email').isEmail().withMessage('Enter a valid email'),
   body('password').isLength({ min: 8 }).withMessage('Password must be min. 8 chars'),
], async (req, res) => {
    const errors = validationResult(req);
    
    // If errors are present (Not isEmpty = contains errors) after 'Validate' render the registration errors into an array
    if(!errors.isEmpty()) {
        return res.render('register', {errors: errors.array() });
    }

    const {username, email, password } = req.body; 
    
    try{
        // Check if user is in the database
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.render('register', {errors: [{ msg: 'Email already registered'}] });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new User
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        
        // Write user to the database
        await newUser.save();
        res.send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;