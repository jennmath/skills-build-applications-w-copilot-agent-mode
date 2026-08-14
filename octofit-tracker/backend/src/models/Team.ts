import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Team = mongoose.models.Team ?? mongoose.model('Team', teamSchema);

export default Team;
