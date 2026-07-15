import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/meetings/attendee/:email', requireAuth, employeeController.getMeetingsByAttendee);

router.get('/:id/created-meetings', requireAuth, employeeController.getCreatedMeetings);

export default router;