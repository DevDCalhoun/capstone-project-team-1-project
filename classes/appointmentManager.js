const Appointment = require('../models/appointment');
const mongoose = require('mongoose');
const User = require('../models/user');
const logger = require('../logging/logger');

class AppointmentManager {
    // Constructor to initialize the appointment manager with userID(SessionID)
    constructor(userId) {
        this.userId = userId;
        this.userRole = userRole;
    }

    // Method creates a new appointment
    async createAppointment(studentId, tutorId, day, time, details) {
        // Role check
        if (!['student', 'tutor', 'admin'].includes(this.userRole)) {
            throw new Error("Permission denied: You do not have access to create appointments");
        }

        try {
            const newAppointment = new Appointment({
                studentId,
                tutorId,
                day,
                time,
                details,
                status: 'Pending'   // Set default status as Pending
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
        // Role check
        if (!['student', 'tutor', 'admin'].includes(this.userRole)) {
            throw new Error("Permission denied: You do not have access to update appointments");
        }
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
        // Role check
        if (!['student', 'tutor', 'admin'].includes(this.userRole)) {
            throw new Error("Permission denied: You do not have access to update appointments");
        }
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

     // New method to set appointment status
     async setAppointmentStatus(appointmentId, newStatus) {
        // Role check
        if (!['tutor', 'admin'].includes(this.userRole)) {
            throw new Error("Permission denied: Only tutors and admins can change appointment status");
        }
        
        const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

        // Check if the provided status is valid
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
        }

        try {
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                throw new Error("Appointment not found");
            }

            // Update the status
            appointment.status = newStatus;
            await appointment.save();

            // Log the status update with pino
            logger.info(`Appointment ${appointmentId} status changed to ${newStatus}`);
            return appointment;
        } catch (error) {
            console.error("Error setting appointment status:", error.message);
            throw error;
        }
    }
}

module.exports = AppointmentManager;