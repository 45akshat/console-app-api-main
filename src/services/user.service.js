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

  // Find a user by email
  async getUserById(email) {
    try {
      return await User.findOne({ Name: email }); // Match schema field
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

 // Update user details by ID using updateOne
async updateUser(userId, updateData) {
  try {
    const result = await User.updateOne(
      { UserID: userId },
      { $set: updateData }
    );

    if (result.nModified === 0) {
      throw new Error('No matching user found or no changes detected.');
    }

    return await User.findOne({ UserID: userId }); // Fetch and return the updated user
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


  async updateUserCP (userId, cp, lastWheelSpun) {
    const user = await User.findOne({ UserID: userId });
  
    if (!user) return null;
  
    user.CP = (user.CP || 0) + cp; // Add CP
    user.Last_Wheel_Spun = lastWheelSpun; // Update last wheel spun date
    user.Wheel_Spun_Today = true; // Set Wheel_Spun_Today to true
  
    return await user.save();
  }

  async updateUserCP(userId, cp, lastWheelSpun) {
    const user = await User.findOne({ UserID: userId });
    console.log('User found:', user);
  
    if (!user) return null;
  
    user.CP = (user.CP || 0) + cp;
    user.Last_Wheel_Spun = lastWheelSpun;
    user.Wheel_Spun_Today = true;
  
    return await user.save();
  }

  async updateUserWallet(userId, wallet_info) {
    const user = await User.findOne({ UserID: userId });
    console.log('User found:', user);
  
    if (!user) return null;
  
    // Ensure Wallet_Info is numeric and update it
    user.Wallet_Info = (user.Wallet_Info || 0) + parseFloat(wallet_info);  // Ensure wallet_info is a number
  
    return await user.save();
  }
  

  async updateUserStreak (req, res) {
    const { userId, currentStreak, loggedInLast, CP } = req.body;
    console.log(req.body);
    try {
      const updatedUser = await UserService.updateUserStreak(userId, currentStreak, loggedInLast, CP);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

}

module.exports = new UserService();
