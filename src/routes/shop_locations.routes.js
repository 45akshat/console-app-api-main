const express = require('express');
const router = express.Router();
const { getShopsNearUser, getAllShops } = require('../controllers/shop_locations.controller');

// Route to fetch shops near the user (using latitude and longitude as query params)
router.get('/shops', getShopsNearUser);
router.get('/shops/all', getAllShops);
module.exports = router;
