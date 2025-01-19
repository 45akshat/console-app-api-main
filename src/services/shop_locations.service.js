const ShopLocation = require('../models/shop_locations.model');

// Fetch shop data based on geolocation (latitude and longitude)
async function fetchShopData(latitude, longitude) {
  console.log('Latitude:', latitude, 'Longitude:', longitude);
  try {
    const shops = await ShopLocation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 500000000000000000000000000000000000000000000000000000000 // 5km in meters
        }
      }
    });
    console.log('Shops:', shops);
    return shops;
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return [];
  }
}

// Fetch all shop data without geospatial filtering
async function getAllShopData() {
  try {
    const shops = await ShopLocation.find({});
    console.log('All Shops:', shops);
    return shops;
  } catch (error) {
    console.error("Error fetching all shop data:", error);
    return [];
  }
}

module.exports = { fetchShopData, getAllShopData };
