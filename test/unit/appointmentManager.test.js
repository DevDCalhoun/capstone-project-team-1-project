const AppointmentManager = require('../../classes/appointmentManager');
const Appointment = require('../../models/appointment');
const mongoose = require('mongoose');
const logger = require('../../logging/logger');

// Mocking Appointment and logger
jest.mock('../../models/appointment');
jest.mock('../../logging/logger');

describe('AppointmentManager.createAppointment', () => {
    let appointmentManager;

    beforeEach(() => {        
        // Initialize AppointmentManager with a dummy user ID
        appointmentManager = new AppointmentManager('dummyUserId');

        // Clear all mock calls before each test
        jest.clearAllMocks();
    });

    it('should create and return a new appointment successfully', async () => {
        // Mock the save method to simulate a successful save
        const mockAppointmentData = {
            studentId: 'studentId123',
            tutorId: 'tutorId123',
            day: new Date(),
            time: '10:00',
            details: 'JavaScript tutoring session'
        };
        
        Appointment.mockImplementation(() => ({
            ...mockAppointmentData,
            save: jest.fn().mockResolvedValue(mockAppointmentData)
        }));

        // Call the createAppointment method
        const result = await appointmentManager.createAppointment(
            mockAppointmentData.studentId,
            mockAppointmentData.tutorId,
            mockAppointmentData.day,
            mockAppointmentData.time,
            mockAppointmentData.details
        );

        // Verify that the result matches the mocked appointment data
        expect(result).toEqual(expect.objectContaining(mockAppointmentData));

        // Verify that the logger was called with the notice message
        expect(logger.notice).toHaveBeenCalledWith("New tutoring appointment created.");
    });

    it('should throw an error if appointment creation fails', async () => {
        // Simulate an error by making save throw an error
        Appointment.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error("Appointment creation failed"))
        }));

        // Call createAppointment and expect it to throw an error
        await expect(appointmentManager.createAppointment(
            'studentId123', 'tutorId123', new Date(), '10:00', 'JavaScript tutoring session'
        )).rejects.toThrow("Appointment creation failed");

        // Verify that the logger was not called due to the error
        expect(logger.notice).not.toHaveBeenCalled();
    });

    describe('getAppointmentById', () => {
        it('should retrieve an appointment by ID successfully', async () => {
            const mockAppointment = {
                _id: 'appointmentId123',
                studentId: 'studentId123',
                tutorId: 'tutorId123',
                day: new Date(),
                time: '10:00',
                details: 'Math tutoring session'
            };

            Appointment.findById = jest.fn().mockResolvedValue(mockAppointment);

            const result = await appointmentManager.getAppointmentById('appointmentId123');
            expect(result).toEqual(mockAppointment);
            expect(Appointment.findById).toHaveBeenCalledWith('appointmentId123');
        });

        it('should throw an error if appointment not found', async () => {
            Appointment.findById = jest.fn().mockResolvedValue(null);

            await expect(appointmentManager.getAppointmentById('appointmentId123'))
                .rejects.toThrow('Appointment not found');
            expect(Appointment.findById).toHaveBeenCalledWith('appointmentId123');
        });
    });

    describe('getAppointmentsByUser', () => {
        it('should retrieve all appointments for a specific user', async () => {
            const validUserId = new mongoose.Types.ObjectId(); // Generates a valid ObjectID
            const validTutorId123 = new mongoose.Types.ObjectId(); // Generates a valid ObjectID
            const validTutorId456 = new mongoose.Types.ObjectId(); // Generates a valid ObjectID

            const mockAppointments = [
                { studentId: validUserId.toString(), tutorId: validTutorId123.toString(), day: new Date(), time: '10:00' },
                { studentId: validUserId.toString(), tutorId: validTutorId456.toString(), day: new Date(), time: '11:00' }
            ];

            Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

            const result = await appointmentManager.getAppointmentsByUser(validUserId.toString());
            expect(result).toEqual(mockAppointments);
            expect(Appointment.find).toHaveBeenCalledWith({
                $or: [{ studentId: validUserId.toString() }, { tutorId: validUserId.toString() }]
            });
        });

        it('should return an empty array if user has no appointments', async () => {
            Appointment.find = jest.fn().mockResolvedValue([]);

            const validUserId = new mongoose.Types.ObjectId(); // Generates a valid ObjectID
    
            const result = await appointmentManager.getAppointmentsByUser(validUserId.toString());
            expect(result).toEqual([]);
            expect(Appointment.find).toHaveBeenCalledWith({
                $or: [{ studentId: validUserId.toString() }, { tutorId: validUserId.toString() }]
            });
        });

        it('should handle invalid user ID format', async () => {
           
            await expect(appointmentManager.getAppointmentsByUser('invalidID'))
                .rejects.toThrow("Invalid user ID");
        });
    });
});