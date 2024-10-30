const availabilitySchema = require('../models/availability');
const User = require('../models/user');

class AvailabilityManager {
  //constructor parameter is for user ID from session
  constructor(userId) {
    this.userId = userId;
  }

  async updateAvailability(day, startTime, endTime) {
    try {
      const user = await User.findById(this.userId);
      
      if(!user) {
        throw new Error('User not found');
      }
      
      if(!user.availability) {
        user.availability = [];
      }

      const availability = user.availability.find(avail => avail.day === day);

      if(availability) {
        availability.startTime = startTime;
        availability.endTime = endTime;
      }
      else {
        user.availability.push({ day, startTime, endTime });
      }
      
      await user.save();
      return user;
    } catch (error) {
      console.error("Error encountered while adding availability", error.message);
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
    return user;        // Testing code REMOVE
  }
}

module.exports = AvailabilityManager;