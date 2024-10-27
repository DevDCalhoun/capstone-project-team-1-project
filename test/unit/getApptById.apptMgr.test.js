const AppointmentManager = require('../../classes/appointmentManager');
const Appointment = require('../../models/appointment');

jest.mock('../../models/appointment');
jest.mock('../../logging/logger');

describe('AppointmentManager', () => {
    let appointmentManager;

    beforeEach(() => {
        appointmentManager = new AppointmentManager('dummyUserId');
        jest.clearAllMocks();
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

});
