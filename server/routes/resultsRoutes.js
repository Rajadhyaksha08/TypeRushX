import express from 'express';
import { saveResult, getMyResults } from '../controllers/resultsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All results routes require JWT auth
router.use(protect);

router.post('/', saveResult);
router.get('/my', getMyResults);

export default router;
