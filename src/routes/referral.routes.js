const express = require('express');
const router = express.Router();
const referralService = require('../services/referral.service');

// Fetch referral code by user ID
router.post('/getReferralCode', async (req, res) => {
  const { userId } = req.body;

  try {
    const referral = await referralService.getReferralCode(userId);

    if (referral) {
      res.json({ code: referral.code });
    } else {
      res.status(404).send('No referral code found for this user.');
    }
  } catch (err) {
    res.status(500).send('Error fetching referral code: ' + err.message);
  }
});

// Save referral code for a user
router.post('/saveReferralCode', async (req, res) => {
  const { userId, referralCode } = req.body;

  try {
    await referralService.saveReferralCode(userId, referralCode);
    res.send('Referral code saved successfully.');
  } catch (err) {
    res.status(500).send('Error saving referral code: ' + err.message);
  }
});

module.exports = router;
