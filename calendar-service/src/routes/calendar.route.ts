import { Router } from 'express';
import { googleCallbackHandler } from '../controllers/calendar.controller.js';

const router = Router();

router.get('/callback', googleCallbackHandler);  

export default router;
