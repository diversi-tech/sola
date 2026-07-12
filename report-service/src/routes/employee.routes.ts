import { Router } from 'express';
import { createNewEmployee, editExistingEmployee } from '../controllers/employee.controller.js';

const router = Router();


router.post('/', createNewEmployee);

router.put('/:id', editExistingEmployee);

export default router;