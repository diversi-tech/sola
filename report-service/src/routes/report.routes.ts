import express from 'express';
import { handleIncomingFeedback } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/analyze', handleIncomingFeedback);

export default router;