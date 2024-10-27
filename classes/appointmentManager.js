const Appointment = require('../models/appointment');
const mongoose = require('mongoose');
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

      // Retrieve all appointments for a specific user
      async getAppointmentsByUser(userId) {
        try {
            // Validate userId format using mongoose's ObjectId checker
            if(!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error("Invalid user ID");
            }

            const appointments = await Appointment.find({
                $or: [{ studentId: userId }, { tutorId: userId }]
            });
            return appointments;
        } catch (error) {
            console.error("Error retrieving appointments:", error.message);
            throw error;
        }
    }

    // Update an appointment
    async updateAppointment(appointmentId, updateData) {
        try {
            const appointment = await Appointment.findByIdAndUpdate(
                appointmentId,
                updateData,
                { new: true } // returns the updated document
            );
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            return appointment;
        } catch (error) {
            console.error("Error updating appointment:", error.message);
            throw error;
        }
    }

    // Delete an appointment by ID
    async deleteAppointment(appointmentId) {
        try {
            const result = await Appointment.findByIdAndDelete(appointmentId);
            if (!result) {
                throw new Error('Appointment not found');
            }
            return `Appointment with ID ${appointmentId} deleted successfully.`;
        } catch (error) {
            console.error("Error deleting appointment:", error.message);
            throw error;
        }
    }
}

module.exports = AppointmentManager;