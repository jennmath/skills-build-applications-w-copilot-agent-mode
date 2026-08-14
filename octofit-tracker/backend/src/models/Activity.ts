import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

const Activity = mongoose.models.Activity ?? mongoose.model('Activity', activitySchema);

export default Activity;
