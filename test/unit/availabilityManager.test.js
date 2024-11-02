const AvailabilityManager = require('../../classes/availabilityManager');
const User = require('../../models/user');

// Mock User model methods
jest.mock('../../models/user', () => ({
  findById: jest.fn(),
}));

describe('AvailabilityManager', () => {
  let availabilityManager;
  const mockUserId = 'mockUserId';

  beforeEach(() => {
    availabilityManager = new AvailabilityManager(mockUserId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateAvailability', () => {
    it('should add a new availability if it does not exist for the given day', async () => {
      const mockUser = {
        availability: [],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      await availabilityManager.updateAvailability('Monday', '09:00', '17:00');

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.availability).toEqual([
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      ]);
    });

    it('should update an existing availability for the given day', async () => {
      const mockUser = {
        availability: [
          { day: 'Monday', startTime: '10:00', endTime: '15:00' },
        ],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      await availabilityManager.updateAvailability('Monday', '09:00', '17:00');

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.availability).toEqual([
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      ]);
    });

    it('should throw an error if user is not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        availabilityManager.updateAvailability('Monday', '09:00', '17:00')
      ).rejects.toThrow('User not found');
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('removeAvailability', () => {
    it('should remove availability for a specific day', async () => {
      const mockUser = {
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        ],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      await availabilityManager.removeAvailability('Monday');

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.availability).toEqual([
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      ]);
    });

    it('should throw an error if user is not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        availabilityManager.removeAvailability('Monday')
      ).rejects.toThrow('User not found');
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });
  });
});
