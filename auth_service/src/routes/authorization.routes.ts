
import { Router, Request, Response } from 'express';
import { verifyPhoneHandler } from '../controllers/authorization.controller.js';

const router = Router();
router.post('/verify-phone',verifyPhoneHandler);

export default router;