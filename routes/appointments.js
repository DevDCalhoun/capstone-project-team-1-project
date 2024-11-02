const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { ensureAuthenticated } = require('../middleware/auth');

// Route to accept an appointment
router.post('/appointments/:id/accept', ensureAuthenticated, appointmentController.acceptAppointment);

// Route to reject an appointment
router.post('/appointments/:id/reject', ensureAuthenticated, appointmentController.rejectAppointment);

module.exports = router;