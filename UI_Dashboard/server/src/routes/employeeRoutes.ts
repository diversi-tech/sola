import { Router } from 'express';
import { employeeController } from '../controllers/employeeController.js';

const router = Router();

// נתיב לשליפת כל העובדים
// יגיב ל- GET /api/employees
router.get('/', employeeController.getAllEmployees);

// נתיב לשליפת עובד בודד לפי ID
// יגיב ל- GET /api/employees/1 (או כל מספר אחר)
router.get('/:id', employeeController.getEmployeeById);

export default router;