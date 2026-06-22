import { Router } from 'express';
import { authorizedUserController } from '../controllers/authorizedUserController.js';

const router = Router();

// GET /api/authorized-users
router.get('/', authorizedUserController.getAllAuthorizedUsers);

// GET /api/authorized-users/:id
router.get('/:id', authorizedUserController.getAuthorizedUserById);

export default router;