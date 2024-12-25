const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/user.model'); // Path to your User model

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_live_NPwaQIImGlemVc', // Replace with your Razorpay Key ID
  key_secret: 'WW61wrDtWqPCuZPGZ3JvQvCh' // Replace with your Razorpay Key Secret
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
      return await User.findOne({ Email: email }); // Match schema field correctly
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

      return User.findOne({ UserID: userId }); // Fetch updated user directly
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
  async getUserLoginDate(userId) {
    try {
      const user = await User.findOne({ UserID: userId });
      if (!user) {
        throw new Error('User not found');
      }
      return user.Logged_In_Last;
    } catch (error) {
      throw new Error(`Error fetching login date: ${error.message}`);
    }
  }

  // Update wallet after payment verification
  async updateUserWallet(userId, wallet, payment_id, signature) {
    try {
      // Verify the payment signature
      const generatedSignature = crypto
        .createHmac('sha256', razorpay.key_secret)
        .update(`${payment_id}|${payment_id}`) // Adjust if order_id|payment_id is used
        .digest('hex');

      if (generatedSignature !== signature) {
        throw new Error('Invalid payment signature');
      }

      // Capture the payment
      const payment = await razorpay.payments.capture(payment_id, wallet * 100); // Amount in paise
      console.log('Payment captured successfully:', payment);

      // Update wallet in database
      const updatedUser = await User.findOneAndUpdate(
        { UserID: userId },
        { $inc: { wallet: wallet } }, // Increment wallet balance
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'Payment verified and wallet updated successfully',
        payment,
        user: updatedUser
      };
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw new Error(`Error updating wallet: ${error.message}`);
    }
  }

  // Update CP and Wheel Spun details
  async updateUserCP(userId, cp, lastWheelSpun) {
    try {
      const user = await User.findOne({ UserID: userId });
      if (!user) {
        throw new Error('User not found');
      }

      user.CP = (user.CP || 0) + cp; // Add CP
      user.Last_Wheel_Spun = lastWheelSpun; // Update last wheel spun date
      user.Wheel_Spun_Today = true; // Set Wheel_Spun_Today to true

      return await user.save();
    } catch (error) {
      throw new Error(`Error updating CP: ${error.message}`);
    }
  }

  // Update streak and CP
  async updateUserStreak(userId, currentStreak, loggedInLast, cpToAdd) {
    try {
      return await User.findOneAndUpdate(
        { UserID: userId },
        {
          $set: {
            Current_Streak: currentStreak,
            Logged_In_Last: loggedInLast
          },
          $inc: { CP: cpToAdd } // Increment CP by cpToAdd
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating streak: ${error.message}`);
    }
  }
}

module.exports = new UserService();
