import { Router } from 'express';
import { addNewPermission, createEmployeeByAdmin, getMe, loginToDashboard, requestPasswordReset, setNewPassword } from '../controllers/localAuth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', requireAuth, getMe);
router.post('/create-employee', requireAuth, createEmployeeByAdmin);
router.post('/login', loginToDashboard);
router.post('/set-password', setNewPassword);
router.post('/add-permission', requireAuth, addNewPermission);
router.post('/request-password-reset', requestPasswordReset);

export default router;