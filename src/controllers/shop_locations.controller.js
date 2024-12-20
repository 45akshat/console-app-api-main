const { fetchShopData, getAllShopData } = require('../services/shop_locations.service');

async function getShopsNearUser(req, res) {
  const { latitude, longitude } = req.query; // Expect latitude and longitude as query parameters
  console.log('Latitude:', Number(latitude));
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const shops = await fetchShopData(Number(latitude), Number(longitude));
    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch shop data' });
  }
}

async function getAllShops(req, res) {
  try {
    const shops = await getAllShopData();
    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch shop data' });
  }
}

module.exports = { getShopsNearUser, getAllShops };
