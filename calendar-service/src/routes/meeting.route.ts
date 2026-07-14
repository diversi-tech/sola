import { Router } from "express";
import { syncCalendar, syncActiveEmployees } from "../controllers/meeting.controller.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { validateSyncCalendarInput } from "../middleware/validate.middleware.js";

const router = Router()

router.post('/id/', validateSyncCalendarInput, catchAsync(syncCalendar));
router.post('/', catchAsync(syncActiveEmployees));

export default router