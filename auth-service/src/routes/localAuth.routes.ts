import { Router } from 'express';
import { addNewPermission, createEmployeeByAdmin, loginToDashboard, requestPasswordReset, setNewPassword } from '../controllers/localAuth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create-employee', requireAuth, createEmployeeByAdmin);
router.post('/login', loginToDashboard);
router.post('/set-password', setNewPassword);
router.post('/add-permission', requireAuth, addNewPermission);
router.post('/request-password-reset', requestPasswordReset);

export default router;