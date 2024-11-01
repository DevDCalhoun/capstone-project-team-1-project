const AppointmentManager = require('../../classes/appointmentManager');
const Appointment = require('../../models/appointment');
const mongoose = require('mongoose');
const logger = require('../../logging/logger');

// Mock Appointment and logger
jest.mock('../../models/appointment');
jest.mock('../../logging/logger');

describe('AppointmentManager Role-Based Access', () => {
    let appointmentManager;
    const mockAppointmentId = 'appointmentId123';
    const mockUserId = 'userId123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createAppointment', () => {
        it('should allow student, tutor, or admin to create an appointment', async () => {
            ['student', 'tutor', 'admin'].forEach(async (role) => {
                appointmentManager = new AppointmentManager(mockUserId, role);
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

                const result = await appointmentManager.createAppointment(
                    mockAppointmentData.studentId,
                    mockAppointmentData.tutorId,
                    mockAppointmentData.day,
                    mockAppointmentData.time,
                    mockAppointmentData.details
                );

                expect(result).toEqual(expect.objectContaining(mockAppointmentData));
                expect(logger.notice).toHaveBeenCalledWith("New tutoring appointment created.");
            });
        });

        it('should throw an error if a guest tries to create an appointment', async () => {
            appointmentManager = new AppointmentManager(mockUserId, 'guest');

            await expect(
                appointmentManager.createAppointment('studentId123', 'tutorId123', new Date(), '10:00', 'Details')
            ).rejects.toThrow("Permission denied: You do not have access to create appointments");
        });
    });

    describe('updateAppointment', () => {
        it('should allow student, tutor, or admin to update an appointment', async () => {
            ['student', 'tutor', 'admin'].forEach(async (role) => {
                appointmentManager = new AppointmentManager(mockUserId, role);

                const mockUpdatedAppointment = {
                    _id: mockAppointmentId,
                    studentId: 'studentId123',
                    tutorId: 'tutorId123',
                    day: new Date(),
                    time: '12:00',
                    details: 'Updated details'
                };

                Appointment.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedAppointment);

                const updateData = { time: '12:00', details: 'Updated details' };
                const result = await appointmentManager.updateAppointment(mockAppointmentId, updateData);

                expect(result).toEqual(mockUpdatedAppointment);
            });
        });

        it('should throw an error if a guest tries to update an appointment', async () => {
            appointmentManager = new AppointmentManager(mockUserId, 'guest');
            const updateData = { time: '12:00', details: 'Updated details' };

            await expect(
                appointmentManager.updateAppointment(mockAppointmentId, updateData)
            ).rejects.toThrow("Permission denied: You do not have access to update appointments");
        });
    });

    describe('setAppointmentStatus', () => {
        it('should allow tutor or admin to set appointment status', async () => {
            ['tutor', 'admin'].forEach(async (role) => {
                appointmentManager = new AppointmentManager(mockUserId, role);
                const mockAppointment = {
                    _id: mockAppointmentId,
                    status: 'Pending',
                    save: jest.fn().mockResolvedValue(true),
                };

                Appointment.findById = jest.fn().mockResolvedValue(mockAppointment);

                await appointmentManager.setAppointmentStatus(mockAppointmentId, 'Confirmed');

                expect(mockAppointment.status).toBe('Confirmed');
                expect(logger.info).toHaveBeenCalledWith(`Appointment ${mockAppointmentId} status changed to Confirmed`);
            });
        });

        it('should throw an error if a student tries to set appointment status', async () => {
            appointmentManager = new AppointmentManager(mockUserId, 'student');

            await expect(
                appointmentManager.setAppointmentStatus(mockAppointmentId, 'Confirmed')
            ).rejects.toThrow("Permission denied: Only tutors and admins can change appointment status");
        });

        it('should throw an error if a guest tries to set appointment status', async () => {
            appointmentManager = new AppointmentManager(mockUserId, 'guest');

            await expect(
                appointmentManager.setAppointmentStatus(mockAppointmentId, 'Confirmed')
            ).rejects.toThrow("Permission denied: Only tutors and admins can change appointment status");
        });
    });
});
