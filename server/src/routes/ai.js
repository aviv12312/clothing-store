import express from 'express';
import { aiLimiter } from '../middleware/rateLimiters.js';
import { chatWithBot } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', aiLimiter, chatWithBot);

export default router;
