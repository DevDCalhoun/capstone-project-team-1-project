const Appointment = require('../models/appointment');
const User = require('../models/user');
const logger = require('../logging/logger');

class AppointmentManager {
    // Constructor to initialize the appointment manager with userID(SessionID)
    constructor(userId) {
        this.userId = userId;
    }

    // Method creates a new appointment
    async createAppointment(studentId, tutorId, day, time, details) {
        try {
            const newAppointment = new Appointment({
                studentId,
                tutorId,
                day,
                time,
                details
            });
            // Save the appointment to the database
            await newAppointment.save();

            // Log the new appointment
            if (newAppointment) {
                logger.notice("New tutoring appointment created.");
            }

            return newAppointment;
        } catch (error) {
            console.error("Error creating appointment: ", error.message);
            throw error;
        }
    }

    // Retrieve an appointment by ID
    async getAppointmentById(appointmentId) {
        try {
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            return appointment;
        } catch (error) {
            console.error("Error retrieving appointment:", error.message);
            throw error;
        }
    }
}

module.exports = AppointmentManager;