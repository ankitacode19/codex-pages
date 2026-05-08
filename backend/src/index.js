import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import codeRoutes from './routes/code.js';
import snippetRoutes from './routes/snippets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

const codeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 15,
  message: { error: 'Too many code executions, please wait a moment.' },
});

app.use(limiter);
app.use(express.json({ limit: '50kb' }));

// Routes
app.use('/run', codeLimiter, codeRoutes);
app.use('/', snippetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeLab backend running on http://localhost:${PORT}`);
});
