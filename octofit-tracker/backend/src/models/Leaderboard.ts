import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, default: 1 },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  },
  { timestamps: true },
);

const Leaderboard = mongoose.models.Leaderboard ?? mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
