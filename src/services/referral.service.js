const Referral = require('../models/referral.model');

// Fetch referral code by user ID
async function getReferralCode(userId) {
  return await Referral.findOne({ made_by: userId });
}

// Save a referral code for a user
async function saveReferralCode(userId, referralCode) {
  // Delete existing referral code for the user
  await Referral.deleteOne({ made_by: userId });

  // Calculate valid till date (10 days from now)
  const currentDate = new Date();
  const validTillDate = new Date();
  validTillDate.setDate(currentDate.getDate() + 10);

  // Insert new referral code
  const newReferral = new Referral({
    code: referralCode,
    made_by: userId,
    active: true,
    used: false,
    valid_till: validTillDate,
  });

  return await newReferral.save();
}

module.exports = {
  getReferralCode,
  saveReferralCode,
};
