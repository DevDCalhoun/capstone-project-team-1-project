const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../../models/user');
const Appointment = require('../../models/appointment');
const { getProfile, postLogin, acceptAppointment } = require('../../controllers/userController');
const mongoose = require('mongoose');

jest.mock('bcrypt');
jest.mock('../../models/user');
jest.mock('../../models/appointment');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('User Controller Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { session: {}, body: {}, params: {}, flash: jest.fn() };
    res = { render: jest.fn(), redirect: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should redirect to login if user not found', async () => {
      const mockUserId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));
      req.session.userId = mockUserId;
  
      await getProfile(req, res, next);
  
      expect(req.flash).toHaveBeenCalledWith('error_msg', 'User not found.');
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });
    
    it('should render user profile with appointments', async () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockUser = { _id: mockUserId, username: 'testUser' };
        const mockAppointment = {
          tutorId: { _id: new mongoose.Types.ObjectId(), username: 'tutor' },
          studentId: mockUserId,
          status: 'Pending',
        };
    
        // Mock User.findById().select()
        User.findById.mockImplementation(() => ({
          select: jest.fn().mockResolvedValue(mockUser),
        }));
    
        // Mock Appointment.find().populate().sort()
        Appointment.find.mockImplementation(() => ({
          populate: jest.fn().mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue([mockAppointment]),
          })),
        }));
    
        req.session.userId = mockUserId;
    
        await getProfile(req, res, next);
    
        expect(res.render).toHaveBeenCalledWith('userProfile', {
          user: mockUser,
          studentAppointments: [mockAppointment],
          tutorAppointments: [mockAppointment],
        });
      });

  });
});
