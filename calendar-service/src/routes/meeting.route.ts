import { Router } from "express";
import { syncCalendar, syncActiveEmployees,getMeetings } from "../controllers/meeting.controller.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { validateSyncCalendarInput } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = Router()
router.get('/', requireAuth, catchAsync(getMeetings));
router.post('/id/', validateSyncCalendarInput, catchAsync(syncCalendar));
router.post('/', catchAsync(syncActiveEmployees));

export default router