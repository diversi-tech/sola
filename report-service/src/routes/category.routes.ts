import express from 'express';
import { createNewCategory, editExistingCategory,fetchAllCategories } from '../controllers/category.controller.js';

const router = express.Router();

router.post('/', createNewCategory);

router.put('/:id', editExistingCategory);

router.get('/', fetchAllCategories);

export default router;