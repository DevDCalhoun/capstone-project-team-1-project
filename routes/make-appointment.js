const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const User = require('../models/user');
const Appointment = require('../models/appointment');

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

// POST route to create an appointment (requires authentication)
router.post('/make-appointment', isAuthenticated, async (req, res) => {
    try {
        const { tutorId, date, time, details } = req.body;
        const studentId = req.session.userId; // Get the logged-in student's ID from the session

        // Find the tutor by ID to ensure they exist
        const tutor = await User.findById(tutorId);
        if (!tutor || !tutor.isTutor) {
            return res.status(404).send('Tutor not found');
        }

        // Create a new appointment
        const newAppointment = new Appointment({
            studentId,
            tutorId,
            day: new Date(`${date}T${time}`),   // Combine data & time into Date object
            time: time,
            details: details || 'General inquiry',
            status: 'Pending'
        });

        // Save the appointment to the database
        await newAppointment.save();

        res.send('Appointment waiting confirmation from tutor.');
        // Redirect to a confirmation page or appointments list
        //res.redirect(''); // Redirect to a page showing confirmed appointments
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
