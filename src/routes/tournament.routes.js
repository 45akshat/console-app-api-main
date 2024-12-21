const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/tournament.controller');

// Endpoint to fetch all tournaments
router.get('/', TournamentController.getAllTournaments);

// Endpoint to register for a tournament
router.post('/register', TournamentController.registerUser);

module.exports = router;
