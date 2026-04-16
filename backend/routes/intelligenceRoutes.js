import express from 'express';
import { protect } from '../middleware/auth.js';
import { discoverRealJobs } from '../controllers/intelligenceController.js';

const router = express.Router();

/**
 * @desc    Search live web for jobs and match them
 * @route   POST /api/intelligence/discover-real-jobs
 * @access  Private
 */
router.post('/discover-real-jobs', protect, discoverRealJobs);

export default router;
