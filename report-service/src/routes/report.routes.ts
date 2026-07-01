import express from 'express';
import { handleIncomingFeedback, handleGetEmployeesWithReports } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/by-employee', handleGetEmployeesWithReports);
router.post('/analyze', handleIncomingFeedback);

export default router;