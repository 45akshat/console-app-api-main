const Code = require('../models/codes.model');
const User = require('../models/user.model'); // Assuming you have a User model

// Fetch all codes
async function fetchAllCodes() {
  try {
    const codes = await Code.find({});
    console.log('All Codes:', codes);
    return codes;
  } catch (error) {
    console.error("Error fetching codes:", error);
    return [];
  }
}

// Fetch codes by user ID
async function fetchCodesByUserID(userID) {
  try {
    const codes = await Code.find({ UserID: userID });
    console.log(`Codes for UserID ${userID}:`, codes);
    return codes;
  } catch (error) {
    console.error(`Error fetching codes for UserID ${userID}:`, error);
    return [];
  }
}

// Create a new code
async function createCode(codeData) {
  try {
    const newCode = new Code(codeData);
    await newCode.save();
    console.log('New Code Created:', newCode);
    return newCode;
  } catch (error) {
    console.error("Error creating code:", error);
    return null;
  }
}

// Update a code by ID
async function updateCode(codeID, updateData) {
  try {
    const updatedCode = await Code.findByIdAndUpdate(codeID, updateData, { new: true });
    console.log('Updated Code:', updatedCode);
    return updatedCode;
  } catch (error) {
    console.error("Error updating code:", error);
    return null;
  }
}

// Redeem a code by deducting "cp" from the user and creating the new code
async function redeemCode(userID, codeData, cpToDeduct) {
  try {
    // Find the user by UserID
    const user = await User.findOne({ UserID: userID });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has enough "cp"
    if (user.CP < cpToDeduct) {
      throw new Error('Insufficient cp');
    }

    // Deduct "cp" from the user
    user.CP -= cpToDeduct;
    await user.save();

    // Create the new code
    const newCode = await createCode(codeData);
    return newCode;
  } catch (error) {
    console.error("Error redeeming code:", error);
    return null;
  }
}

module.exports = { fetchAllCodes, fetchCodesByUserID, createCode, updateCode, redeemCode };
