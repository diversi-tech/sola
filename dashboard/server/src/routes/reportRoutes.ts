import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';

const router = Router();

// GET /api/reports
router.get('/', reportController.getAllReports);

// GET /api/reports/:id
router.get('/:id', reportController.getReportById);

export default router;