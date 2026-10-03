import express from 'express';
import {
  getDailyChallenge,
  completeDailyChallenge
} from '../controllers/dailyChallengeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDailyChallenge);
router.post('/complete', protect, completeDailyChallenge);

export default router;