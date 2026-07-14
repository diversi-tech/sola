import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware.js';

const router = Router();

// Every admin route requires an authenticated user with the MANAGE_DASHBOARD permission.
router.use(requireAuth, requirePermission('MANAGE_DASHBOARD'));

router.get('/permissions', adminController.getPermissions);

router.get('/employees', adminController.getEmployees);

router.put('/employees/:id/permissions', adminController.updatePermissions);

export default router;