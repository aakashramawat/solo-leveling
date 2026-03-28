import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { playerRouter } from './routes/player.js';
import { taskRouter } from './routes/task.js';
import { dailyRouter } from './routes/daily.js';
import { questRouter } from './routes/quest.js';

const app = express();
const PORT = 3001;

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'Solo Leveling API' });
});

// Routes
app.use('/api/player', playerRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/daily', dailyRouter);
app.use('/api/quests', questRouter);

app.listen(PORT, () => {
  console.log(`⚔️  Solo Leveling server running on http://localhost:${PORT}`);
});

// Global error handler — must be last, after all routes
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server error]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

