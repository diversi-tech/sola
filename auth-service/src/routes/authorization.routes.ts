
import { Router, Request, Response } from 'express';
import { loginHandler } from '../controllers/authorization.controller.js';

const router = Router();
router.post('/login',loginHandler);

export default router;