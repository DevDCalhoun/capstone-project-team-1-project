const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const User = require('../models/user');
const appointment = require('../models/appointment');

// GET route to display the appointment page (requires authentication)
router.get('/make-appointment', isAuthenticated, async (req, res) => {
    try {
        const { tutorId } = req.query;

        // Find the tutor by their tutorId and populate their availability
        const tutor = await User.findById(tutorId).populate('availability');
        if (!tutor || !tutor.isTutor) {
            return res.status(404).send('Tutor not found');
        }

        // Render the appointment making page, passing the tutor availability details
        res.render('make-appointment', { tutor });
    } catch(error) {
        console.error('Error loading appointment page: ', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
