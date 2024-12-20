const express = require('express');
const router = express.Router();
const { getAllCodes, getCodesByUserID, createNewCode, updateExistingCode, redeemCodeController } = require('../controllers/codes.controller');

// Route to fetch all codes
router.get('/codes', getAllCodes);

// Route to fetch codes by user ID
router.get('/codes/:userID', getCodesByUserID);

// Route to create a new code
router.post('/codes', createNewCode);

// Route to update a code by ID
router.put('/codes/:codeID', updateExistingCode);

// Route to redeem a code
router.post('/codes/redeem', redeemCodeController);

module.exports = router;
