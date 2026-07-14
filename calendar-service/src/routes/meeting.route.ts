import { Router } from "express";
import { catchAsync } from "../middleware/error.middleware.js";
import { validateSyncCalendarInput } from "../middleware/validate.middleware.js";
import { syncCalendar, syncActiveUsers, getMeetings } from "../controllers/meeting.controller.js";
const router = Router()
router.get('/', catchAsync(getMeetings));
router.post('/id/', validateSyncCalendarInput, catchAsync(syncCalendar));
router.post('/', catchAsync(syncActiveUsers));

export default router
