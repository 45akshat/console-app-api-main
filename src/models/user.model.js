const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  UserID: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  CP: { type: Number, default: 0 }, // Points or coins
  Check_In_Time: { type: Date, default: null },
  Check_In_Status: { type: Boolean, default: false },
  Wallet_Info: { type: Number, default: 0 },
  Current_Streak: { type: Number, default: 0 },
  Wheel_Spun_Today: { type: Boolean, default: false },
  Logged_In_Last: { type: String, default: null },
  Password: { type: String, default: null }, // Assuming hashed password
  contact: { type: String, required: true },
  dob: { type: Date, default: null },
  full_name: { type: String, required: true },
  insta_id: { type: String, default: null },
  Last_Wheel_Spun: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  detailsFilled: { type: Boolean, default: false },
  address: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
