import express from 'express';
import { protect } from '../middleware/auth.js';
import { getDashboardAnalysis } from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/dashboard/analysis
router.get('/analysis', protect, getDashboardAnalysis);

export default router;
