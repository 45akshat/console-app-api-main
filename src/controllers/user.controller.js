const UserService = require('../services/user.service');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const disposableEmailDetector = require('disposable-email-detector').default;

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: 'info@consolegaming.in', // Your email address
    pass: 'rdvx znri pknd xjqj',
  },
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Normalize email function
function normalizeEmail(email) {
  let [local, domain] = email.split("@"); // Split local and domain parts
  local = local.replace(/[+.]/g, ""); // Remove '.' and '+'
  return `${local}@${domain}`;
}

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
      let { email } = req.body; // Extract email from the request body
      if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // Handle missing email
      }
      email = normalizeEmail(email.replace(/\s+/g, '')); // Normalize email
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

  async updateUserCP(req, res) {
    const { userId, cp, lastWheelSpun } = req.body;

    try {
      const updatedUser = await UserService.updateUserCP(userId, cp, lastWheelSpun);
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User CP updated successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUserWallet(req, res) {
    const { userId, wallet, cp } = req.body;

    try {
      const updatedUser = await UserService.updateUserWallet(userId, wallet, cp);
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User wallet updated successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUserStreak(req, res) {
    const { userId, currentStreak, loggedInLast, CP } = req.body;
    console.log(req.body);
    try {
      const updatedUser = await UserService.updateUserStreak(userId, currentStreak, loggedInLast, CP);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async signIn(req, res) {
    let { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ success: false, message: 'Email and phone are required.' });
    }

    try {
      email = normalizeEmail(email.replace(/\s+/g, '').toLowerCase()); // Normalize email

      const isDisposable = await disposableEmailDetector(email);
      if (isDisposable) {
        return res.status(500).json({ success: false, message: 'Disposable email addresses are not allowed.' });
      }

      const user = await UserService.findUserByEmail(email); // Check if the email already exists

      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      // Get the current date and subtract one day
      const priorDate = new Date();
      priorDate.setDate(priorDate.getDate() - 1);

      // Format the date to YYYY-MM-DD
      const formattedDate = priorDate.toISOString().split('T')[0];

      if (user) {
        // If user exists, update only OTP and OTP expiry
        await UserService.updateUserOTP(user.UserID, otp, otpExpiry);
      } else {
        // Generate a unique UserID
        const userId = crypto.randomUUID();

        // Create a new user document
        await UserService.createUser({
          UserID: userId, // Unique user ID
          Name: email,
          otp: otp, // Generated OTP
          otpExpiry: otpExpiry, // OTP expiry time
          detailsFilled: false,
          // Additional Fields
          CP: 200, // Default CP value
          Check_In_Time: null, // No check-in time yet
          Check_In_Status: false, // Default check-in status
          Wallet_Info: 0, // Default wallet balance
          Current_Streak: 0, // Default streak count
          Wheel_Spun_Today: false, // Default wheel spin status
          Logged_In_Last: formattedDate, // No login yet
          Password: null, // No password initially
          contact: phone, // Contact number
          dob: null, // No DOB initially
          full_name: null, // No full name initially
          insta_id: null, // No Instagram ID initially
          Last_Wheel_Spun: formattedDate, // No wheel spin record
        });
      }

      // Send OTP via email
      await transporter.sendMail({
        from: 'info@consolegaming.in',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });

      res.json({ success: true, message: 'OTP sent successfully.' });
    } catch (error) {
      console.error('Error during sign-in:', error);
      res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
  }

  async verifyOTP(req, res) {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    try {
      email = normalizeEmail(email.replace(/\s+/g, '')); // Normalize email

      // Check if the email is the demo account
      if (email === "testing@gmail.com") {
        const testOTP = "665544"; // Test OTP
        const testUser = {
          id: 'be549f98-17df-49aa-aca9-6e397157f38a',
          email: email,
          name: 'Akshat',
          phone: '9022559233',
          address: 'Dadar Mumbai',
        };

        // If the OTP matches for the test user, proceed
        if (otp === testOTP) {
          return res.json({
            success: true,
            message: 'User exists. Redirecting to homepage.',
            detailsFilled: true,
            user: testUser,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid OTP for test account.',
          });
        }
      }

      const user = await UserService.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.otp !== otp || new Date() > user.otpExpiry) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
      }

      // Clear OTP
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      res.json({
        success: true,
        message: user.detailsFilled ? 'User exists. Redirecting to homepage.' : 'New user. Redirecting to details page.',
        detailsFilled: user.detailsFilled,
        user: {
          id: user.UserID,
          email: user.Name,
          phone: user.contact,
          name: user.full_name || null,
          address: user.address || null,
        },
      });
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
  }

  async fillDetails(req, res) {
    let { email, full_name, address, dob, insta_id, referral_code } = req.body;

    if (!email || !full_name || !address || !dob || !insta_id) {
      return res.status(400).json({ success: false, message: 'Email, name, and address are required.' });
    }

    try {
      email = normalizeEmail(email.replace(/\s+/g, '')); // Normalize email

      const user = await UserService.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Preprocess the Name field to remove spaces and convert to lowercase
      user.Name = user.Name.replace(/\s+/g, '').toLowerCase();
      user.full_name = full_name;
      user.address = address;
      user.dob = dob;
      user.insta_id = insta_id;
      user.Check_In_Time = new Date(Date.now());
      user.Check_In_Status = true;
      user.detailsFilled = true;

      let referrer = null;

      if (referral_code) {
        const referral = await UserService.findReferralByCode(referral_code);
        if (referral) {
          referrer = referral.made_by;
          user.CP += 200;
        } else {
          return res.status(400).json({ success: false, message: 'Invalid referral code.' });
        }
      }

      await user.save();

      res.json({
        success: true,
        message: 'Details saved successfully. Redirecting to homepage.',
        user: {
          id: user.UserID,
          Name: user.Name,
          phone: user.contact,
          full_name: user.full_name,
          address: user.address,
          dob: user.dob,
          cp: user.CP,
          wallet: user.Wallet_Info,
          insta_id: user.insta_id,
          referrer: referrer,
        },
      });
    } catch (error) {
      console.error('Error during details saving:', error);
      res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
  }

  async updateReferrerCP(req, res) {
  }

  async updateReferrerCP(req, res) {
    const { referrerId, points } = req.body;

    if (!referrerId || !points) {
      return res.status(400).json({ success: false, message: 'Referrer ID and points are required.' });
    }

    try {
      const user = await UserService.getUserByUserId(referrerId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      user.CP = (user.CP || 0) + points;
      await user.save();

      res.json({ success: true, message: 'Referrer CP updated successfully.', user });
    } catch (error) {
      console.error('Error updating referrer CP:', error);
      res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
  }
}

module.exports = new UserController();
