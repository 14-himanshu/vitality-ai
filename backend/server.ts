import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import modular routes
import authRoutes from './routes/authRoutes';
import metricsRoutes from './routes/metricsRoutes';
import integrationRoutes from './routes/integrationRoutes';
import goalsRoutes from './routes/goalsRoutes';
import agentRoutes from './routes/agentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/agent', agentRoutes);

import { errorHandler } from './middleware/errorHandler';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MVC Backend is running smoothly!' });
});

// Global Error Handler should be the last piece of middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
