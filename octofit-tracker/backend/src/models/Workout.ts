import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, default: 'moderate' },
    description: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

const Workout = mongoose.models.Workout ?? mongoose.model('Workout', workoutSchema);

export default Workout;
