import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB at:', connectionString);
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const teams = await Team.insertMany([
      {
        name: 'Sunrise Striders',
        description: 'Early-morning runners focused on endurance and race prep.',
        points: 340,
      },
      {
        name: 'Peak Pioneers',
        description: 'Strength-first athletes building power and mobility.',
        points: 430,
      },
    ]);

    const users = await User.insertMany([
      {
        name: 'Ava Patel',
        email: 'ava.patel@example.com',
        fitnessLevel: 'intermediate',
        team: teams[0]._id,
      },
      {
        name: 'Mason Lee',
        email: 'mason.lee@example.com',
        fitnessLevel: 'advanced',
        team: teams[1]._id,
      },
      {
        name: 'Sofia Gomez',
        email: 'sofia.gomez@example.com',
        fitnessLevel: 'beginner',
        team: teams[0]._id,
      },
      {
        name: 'Noah Brooks',
        email: 'noah.brooks@example.com',
        fitnessLevel: 'intermediate',
        team: teams[1]._id,
      },
    ]);

    await Team.updateMany({}, { $set: { members: users.map((user) => user._id) } });

    const activities = await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'Running',
        durationMinutes: 35,
        caloriesBurned: 420,
        date: new Date('2026-08-10T06:30:00.000Z'),
        notes: 'Tempo run through the river trail.',
      },
      {
        user: users[1]._id,
        type: 'Strength',
        durationMinutes: 55,
        caloriesBurned: 610,
        date: new Date('2026-08-09T18:15:00.000Z'),
        notes: 'Upper-body and core circuit',
      },
      {
        user: users[2]._id,
        type: 'Cycling',
        durationMinutes: 28,
        caloriesBurned: 310,
        date: new Date('2026-08-08T07:00:00.000Z'),
        notes: 'Recovery spin with easy cadence.',
      },
      {
        user: users[3]._id,
        type: 'Hiking',
        durationMinutes: 45,
        caloriesBurned: 480,
        date: new Date('2026-08-11T09:45:00.000Z'),
        notes: 'Hill climb and scenic loop.',
      },
    ]);

    const leaderboardEntries = await Leaderboard.insertMany([
      {
        user: users[0]._id,
        score: 940,
        rank: 2,
        team: teams[0]._id,
      },
      {
        user: users[1]._id,
        score: 1160,
        rank: 1,
        team: teams[1]._id,
      },
      {
        user: users[2]._id,
        score: 810,
        rank: 4,
        team: teams[0]._id,
      },
      {
        user: users[3]._id,
        score: 880,
        rank: 3,
        team: teams[1]._id,
      },
    ]);

    const workouts = await Workout.insertMany([
      {
        name: 'HIIT Blast',
        category: 'Cardio',
        durationMinutes: 20,
        difficulty: 'advanced',
        description: 'Intervals designed to maximize effort and improve conditioning.',
        user: users[1]._id,
      },
      {
        name: 'Core Stability',
        category: 'Strength',
        durationMinutes: 30,
        difficulty: 'moderate',
        description: 'Planks, dead bugs, and loaded carries.',
        user: users[0]._id,
      },
      {
        name: 'Mobility Flow',
        category: 'Recovery',
        durationMinutes: 15,
        difficulty: 'beginner',
        description: 'Slow stretches and breath work for post-run recovery.',
        user: users[2]._id,
      },
      {
        name: 'Leg Power Circuit',
        category: 'Strength',
        durationMinutes: 40,
        difficulty: 'advanced',
        description: 'Squats, lunges, and kettlebell work to build leg drive.',
        user: users[3]._id,
      },
    ]);

    console.log(
      `Created ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${leaderboardEntries.length} leaderboard entries, and ${workouts.length} workouts.`,
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

void seedDatabase();
