import { Router } from 'express';
import { employeeController } from '../controllers/employeeController.js';

const router = Router();

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

export default router;