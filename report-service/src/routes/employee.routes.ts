import express from 'express';
import { analyzeAndParseFeedback } from '../controllers/employee.controller.js';

const router = express.Router();

router.post('/analyze-and-parse', analyzeAndParseFeedback);

export default router;