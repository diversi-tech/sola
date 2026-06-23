import { Router } from 'express';
import { generateAuthUrlHandler } from '../controllers/calendarAuth.controller.js';

const router = Router();
router.post('/calendar-subscription', generateAuthUrlHandler);

export default router;