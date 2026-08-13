import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database';
import User from './models/User';
import Team from './models/Team';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Workout from './models/Workout';

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

const allowedOrigins = [
  'http://localhost:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

void connectDB();

const createResourceRouter = (model: mongoose.Model<any>, resourceName: string) => {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const items = await model.find({}).lean();
      res.json({ resource: resourceName, data: items });
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch ${resourceName}`, error });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const item = await model.findById(req.params.id).lean();

      if (!item) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      return res.json(item);
    } catch (error) {
      return res.status(500).json({ message: `Failed to fetch ${resourceName}`, error });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const item = await model.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: `Unable to create ${resourceName}`, error });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const item = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      return res.json(item);
    } catch (error) {
      return res.status(400).json({ message: `Unable to update ${resourceName}`, error });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const item = await model.findByIdAndDelete(req.params.id);

      if (!item) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      res.json({ message: `${resourceName} deleted`, id: req.params.id });
    } catch (error) {
      res.status(400).json({ message: `Unable to delete ${resourceName}`, error });
    }
  });

  return router;
};

app.use('/api/users', createResourceRouter(User, 'user'));
app.use('/api/teams', createResourceRouter(Team, 'team'));
app.use('/api/activities', createResourceRouter(Activity, 'activity'));
app.use('/api/leaderboard', createResourceRouter(Leaderboard, 'leaderboard entry'));
app.use('/api/workouts', createResourceRouter(Workout, 'workout'));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    port,
    baseUrl,
    codespaceName: codespaceName ?? null,
  });
});

export default app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`OctoFit Tracker backend is running on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
  });
}
