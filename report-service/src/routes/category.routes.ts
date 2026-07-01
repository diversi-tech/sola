import express from 'express';
import { createNewCategory, editExistingCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.post('/', createNewCategory);

router.put('/:id', editExistingCategory);

export default router;
