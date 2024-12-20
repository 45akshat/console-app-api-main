const User = require('../models/user.model'); // Path to your User model

class UserService {
  // Create a new user
  async createUser(userData) {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find a user by ID
  async getUserById(userId) {
    try {
      return await User.findOne({ UserID: userId });
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  // Update user details by ID
  async updateUser(userId, updateData) {
    try {
      return await User.findOneAndUpdate(
        { UserID: userId },
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete a user by ID
  async deleteUser(userId) {
    try {
      return await User.findOneAndDelete({ UserID: userId });
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  // Get user login date
  async getUserLoginDate(userID) {
    try {
      const user = await User.findOne({ UserID: userID });
      if (!user) {
        throw new Error('User not found');
      }
      return user.Logged_In_Last;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
