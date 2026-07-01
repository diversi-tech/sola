import { Router } from 'express';
import { meetingController } from '../controllers/meetingController.js';

const router = Router();

// GET /api/meetings
router.get('/', meetingController.getAllMeetings);

// GET /api/meetings/employee/:employeeId
router.get('/employee/:employeeId', meetingController.getMeetingsByEmployee);

// GET /api/meetings/:id
router.get('/:id', meetingController.getMeetingById);

export default router;