import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/message', protect, sendMessage);
router.get('/history', protect, getChatHistory);

export default router;
