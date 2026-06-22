import { Router } from "express";
import { syncCalendar, syncActiveUsers } from "../controllers/meeting.controller.js";

const router = Router()

router.post('/:userID',syncCalendar)

router.post('/',syncActiveUsers)

export default router

