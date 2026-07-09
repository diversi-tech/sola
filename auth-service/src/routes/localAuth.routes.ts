import { Router } from 'express';
import { createEmployeeByAdmin, loginToDashboard, setNewPassword } from '../controllers/localAuth.controller.js';

const router = Router();

router.post('/create-employee', createEmployeeByAdmin);

router.post('/login', loginToDashboard);

router.post('/set-password', setNewPassword);

export default router;