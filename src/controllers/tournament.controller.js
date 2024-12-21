const TournamentService = require('../services/tournament.service');

class TournamentController {
  async getAllTournaments(req, res) {
    try {
      const tournaments = await TournamentService.getAllTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async registerUser(req, res) {
    try {
      const { tournamentId, ...userDetails } = req.body;
      const result = await TournamentService.registerUser(tournamentId, userDetails);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new TournamentController();
