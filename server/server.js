import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resultsRoutes from './routes/resultsRoutes.js';
import dailyChallengeRoutes from './routes/dailyChallengeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
const DB_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    server: 'running',
    database: {
      status: DB_STATES[dbState] || 'unknown',
      host: mongoose.connection.host || null
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/daily-challenge', dailyChallengeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

