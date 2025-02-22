const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  tournament_name: { type: String, required: true },
  tournament_id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  tournament_info: { type: String, required: true },
  tournament_image: { type: String, required: true },
  registered: { type: Map, of: [Object], default: {} }, // Map with array of registered player objects
  tournament_cost: { type: String, required: true },
});

module.exports = mongoose.model('Tournament', TournamentSchema);
