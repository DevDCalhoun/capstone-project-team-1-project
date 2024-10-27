const AppointmentManager = require('../../classes/appointmentManager');
const Appointment = require('../../models/appointment');
const mongoose = require('mongoose');

jest.mock('../../models/appointment');
jest.mock('../../logging/logger');

describe('AppointmentManager', () => {
    let appointmentManager;

    beforeEach(() => {
        appointmentManager = new AppointmentManager('dummyUserId');
        jest.clearAllMocks();
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
