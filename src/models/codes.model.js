const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true
  },
  Code: {
    type: String,
    required: true
  },
  Reward: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  },
  Validity: {
    type: String,
    default: '30 days'
  }
});

// Middleware to adjust Date to IST before saving
codeSchema.pre('save', function (next) {
  if (this.Date) {
    // Convert UTC date to IST (UTC +5:30)
    const ISTOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    this.Date = new Date(this.Date.getTime() + ISTOffset);
  }
  next();
});

const Code = mongoose.model('Code', codeSchema, 'codes');

module.exports = Code;
