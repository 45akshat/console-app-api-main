const { fetchAllCodes, fetchCodesByUserID, createCode, updateCode, redeemCode } = require('../services/codes.service');

// Controller to get all codes
async function getAllCodes(req, res) {
  const codes = await fetchAllCodes();
  res.json(codes);
}

// Controller to get codes by user ID
async function getCodesByUserID(req, res) {
  const userID = req.params.userID;
  const codes = await fetchCodesByUserID(userID);
  res.json(codes);
}

// Controller to create a new code
async function createNewCode(req, res) {
  const codeData = req.body;
  const newCode = await createCode(codeData);
  res.json(newCode);
}

// Controller to update a code by ID
async function updateExistingCode(req, res) {
  const codeID = req.params.codeID;
  const updateData = req.body;
  const updatedCode = await updateCode(codeID, updateData);
  res.json(updatedCode);
}

// Controller to redeem a code
async function redeemCodeController(req, res) {
  const { userID, codeData, cpToDeduct } = req.body;
  const newCode = await redeemCode(userID, codeData, cpToDeduct);
  res.json(newCode);
}

module.exports = { getAllCodes, getCodesByUserID, createNewCode, updateExistingCode, redeemCodeController };
