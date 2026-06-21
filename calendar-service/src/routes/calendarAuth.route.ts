import { Router } from 'express';
import { generateAuthUrlHandler } from '../controllers/calendarAuth.controller.js';

const router = Router();
router.post('/generate-auth-url', generateAuthUrlHandler);

export default router;