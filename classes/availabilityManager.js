const availabilitySchema = require('../models/availability');
const User = require('../models/user');

class AvailabilityManager {
  //constructor parameter is for user ID from session
  constructor(userId) {
    this.userId = userId;
  }

  async addAvailability(day, startTime, endTime) {
    try {
      const user = await User.findById(this.userId);
      
      if(!user) {
        throw new Error('User not found');
      }

      if(!user.availability) {
        user.availability = [];
      }

      const newAvailability = { day, startTime, endTime };

      user.availability.push(newAvailability);

      await user.save();
    } catch (error) {
      console.error("Error encountered while adding availability", error.message);
      throw error;
    }
  }

  async updateAvailability(day, newStartTime, newEndTime) {
    try {
      const user = await User.findById(this.userId);

      if(!user) {
        throw new Error('User not found');
      }

      const availability = user.availability.find(avail => avail.day === day);
      if(!availability) {
        throw new Error(`Availability not found for ${day}`);
      }

      availability.startTime = newStartTime;
      availability.endTime = newEndTime;

      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating availability', error.message);
      throw error;
    }
  }

  async removeAvailability(day) {
    const user = await User.findById(this.userId);
    if(!user) {
      throw new Error('User not found');
    }

    user.availability.filter(avail => avail.day !== day);
    await user.save();
    return user;
  }
}

module.exports = AvailabilityManager;