import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import entitiesRouter from './routes/entities.js';
import aiRouter from './routes/ai.js';
import analyticsRouter from './routes/analytics.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ path: process.env.DOTENV_PATH || undefined });

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_ORIGIN.split(',').map((item) => item.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/ai', authMiddleware, aiRouter);
app.use('/analytics', authMiddleware, analyticsRouter);
app.use('/entities', authMiddleware, entitiesRouter);

app.use(errorHandler);

export default app;
