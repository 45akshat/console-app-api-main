const User = require('../models/user.model'); // Path to your User model
const Razorpay = require("razorpay");
const axios = require("axios");

// Razorpay instance initialization
const razorpay = new Razorpay({
  key_id: "rzp_live_NPwaQIImGlemVc",
  key_secret: "WW61wrDtWqPCuZPGZ3JvQvCh",
});


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



  async updateUserWallet(userId, amountToAdd,  topUpAmount, cp, paymentId) {
    try {
      // Step 1: Capture the payment
      const captureResponse = await razorpay.payments.capture(paymentId, topUpAmount * 100); // Amount in paise
      console.log("Payment capture response:", captureResponse);
  
      // Step 2: Verify the payment status
      if (captureResponse.status !== "captured") {
        throw new Error("Payment capture failed");
      }
  
      // Step 3: Update the user's wallet
      const user = await User.findOne({ UserID: userId });
      if (!user) {
        console.error("User not found");
        return null;
      }
  
      console.log("User found:", user);
      user.CP = (user.CP || 0) + parseFloat(cp);
      user.Wallet_Info = (user.Wallet_Info || 0) + parseFloat(amountToAdd);
  
      const updatedUser = await user.save();
      console.log("User wallet updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user wallet:", error.message);
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
  
  async updateUserStreak(userId, currentStreak, loggedInLast, cpToSet) {
    return await User.findOneAndUpdate(
      { UserID: userId },
      {
        $set: {
          Current_Streak: currentStreak,
          Logged_In_Last: loggedInLast,
          CP: cpToSet, // Set CP to the value of cpToSet
        },
      },
      { new: true }
    );
  }
  
}

module.exports = new UserService();
