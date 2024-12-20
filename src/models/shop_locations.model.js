const mongoose = require('mongoose');

const shopLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  timings: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  x: { type: String, required: true },
  y: { type: String, required: true },
  offers: {
    PC: { type: String },
    PS: { type: String }
  },
  imageUrl: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
  }
});

// Create a geospatial index on the location field
shopLocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ShopLocation', shopLocationSchema, 'shop_locations');