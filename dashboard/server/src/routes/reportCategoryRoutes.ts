import { Router } from 'express';
import { reportCategoryController } from '../controllers/reportCategoryController.js';

const router = Router();

// GET /api/report-categories
router.get('/', reportCategoryController.getAllCategories);

// GET /api/report-categories/:id
router.get('/:id', reportCategoryController.getCategoryById);

export default router;