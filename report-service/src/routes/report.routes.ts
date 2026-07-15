import express from 'express';
import { handleIncomingFeedback, handleGetEmployeesWithReports } from '../controllers/report.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/by-employee', requireAuth, handleGetEmployeesWithReports);
router.post('/analyze', handleIncomingFeedback);

export default router;