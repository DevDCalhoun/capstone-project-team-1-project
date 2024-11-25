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

  describe('postLogin', () => {
    it('should handle errors during login', async () => {
      req.body.username = 'user1';
      User.findOne.mockRejectedValue(new Error('Database error'));

      await postLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.render).toHaveBeenCalledWith('login', { error: 'An error occured. Please try again later.' });
    });
  });

  describe('acceptAppointment', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: { id: '123' },
        session: { userId: '456' },
        flash: jest.fn(),
      };
      res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      jest.clearAllMocks();
    });
  
    it('should redirect with error if appointment not found', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValue(true),
      });
      Appointment.findById.mockResolvedValueOnce(null);
  
      await acceptAppointment(req, res);
  
      expect(validationResult).toHaveBeenCalledWith(req);
      expect(req.flash).toHaveBeenCalledWith('error_msg', 'Appointment not found.');
      expect(res.redirect).toHaveBeenCalledWith('/appointments/profile');
    });
  
    it('should handle validation errors', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Validation error' }]),
      });
  
      await acceptAppointment(req, res);
  
      expect(req.flash).toHaveBeenCalledWith('error_msg', 'Validation error');
      expect(res.redirect).toHaveBeenCalledWith('/appointments/profile');
    });
  });
});
