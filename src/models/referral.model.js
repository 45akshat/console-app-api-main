const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  code: { type: String, required: true },
  made_by: { type: String, required: true },
  active: { type: Boolean, default: true },
  used: { type: Boolean, default: false },
  valid_till: { type: Date, required: true },
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
