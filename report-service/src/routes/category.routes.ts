import express from 'express';
import { createNewCategory, editExistingCategory,fetchAllCategories } from '../controllers/category.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createNewCategory);

router.put('/:id', editExistingCategory);

router.get('/', requireAuth, fetchAllCategories);

export default router;