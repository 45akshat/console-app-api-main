const Tournament = require('../models/tournament.model');
const User = require('../models/user.model');

class TournamentService {
  async getAllTournaments() {
    return await Tournament.find({});
  }

  async registerUser(tournamentId, userDetails) {
    const tournament = await Tournament.findOne({ tournament_id: tournamentId });
    if (!tournament) throw new Error('Tournament not found');

    const user = await User.findOne({ UserID: userDetails.userId });
    if (!user || user.Wallet_Info < parseInt(tournament.tournament_cost)) {
      throw new Error('Insufficient funds or user not found');
    }

    // Deduct the tournament cost from the user's wallet
    user.Wallet_Info -= parseInt(tournament.tournament_cost);
    await user.save();

    // Update the tournament's registered list
    const userRegistration = {
      username: userDetails.username,
      contact: userDetails.contact,
      dob: userDetails.dob,
      insta_id: userDetails.insta_id,
      full_name: userDetails.full_name,
    };

    if (!tournament.registered.has(userDetails.userId)) {
      tournament.registered.set(userDetails.userId, [userRegistration]);
    } else {
      const existingRegistrations = tournament.registered.get(userDetails.userId);
      existingRegistrations.push(userRegistration);
      tournament.registered.set(userDetails.userId, existingRegistrations);
    }

    await tournament.save();

    return { updatedWallet: user.Wallet_Info };
  }
}

module.exports = new TournamentService();
