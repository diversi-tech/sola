import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

const router = Router();

router.get('/permissions', adminController.getPermissions);

router.get('/employees', adminController.getEmployees);

router.put('/employees/:id/permissions', adminController.updatePermissions);

export default router;