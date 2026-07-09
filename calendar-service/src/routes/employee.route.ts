import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller.js';

const router = Router();

router.get('/meetings/attendee/:email', employeeController.getMeetingsByAttendee);

router.get('/:id/created-meetings', employeeController.getCreatedMeetings);

export default router;