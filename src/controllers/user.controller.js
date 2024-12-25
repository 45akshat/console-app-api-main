const UserService = require('../services/user.service');

class UserController {
  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { email } = req.body; // Extract email from the request body
      if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // Handle missing email
      }
      const user = await UserService.getUserById(email);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  }

  async updateProfile(req, res) {
    try {
      const { userId, full_name, address } = req.body;
      const updatedUser = await UserService.updateUser(userId, {
        full_name,
        address,
      });
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      if (deletedUser) {
        res.json({ message: 'User deleted' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async checkLoginDate(req, res) {
    try {
      const Logged_In_Last = await UserService.getUserLoginDate(req.params.userID);
      res.json({ Logged_In_Last });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  async updateUserCP (req, res) {
    const { userId, cp, lastWheelSpun } = req.body;
  
    try {
      const updatedUser = await UserService.updateUserCP(userId, cp, lastWheelSpun);
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  
      res.json({ message: 'User CP updated successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUserWallet (req, res) {
    const { userId, amountToAdd,  topUpAmount, cp, paymentId} = req.body;
  
    try {
      const updatedUser = await UserService.updateUserWallet(userId, amountToAdd,  topUpAmount, cp, paymentId);
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  
      res.json({ message: 'User wallet updated successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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

module.exports = new UserController();
