import { Router } from 'express';
import { generateAuthUrlHandler,getAuthStatusesHandler, revokeCalendarAccessHandler  } from '../controllers/calendarAuth.controller.js';

const router = Router();
router.post('/calendar-subscription', generateAuthUrlHandler);
router.get('/statuses', getAuthStatusesHandler);
router.post('/revoke', revokeCalendarAccessHandler);

 

export default router;