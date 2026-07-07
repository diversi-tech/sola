import { Router } from "express";
import { syncCalendar, syncActiveUsers } from "../controllers/meeting.controller.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { validateSyncCalendarInput } from "../middleware/validate.middleware.js";

const router = Router()

router.post('/id/', validateSyncCalendarInput, catchAsync(syncCalendar));
router.post('/', catchAsync(syncActiveUsers));

export default router
