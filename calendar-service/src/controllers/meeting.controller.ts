import { Request,Response } from "express"
import { syncAllActiveUsers, syncUserCalendar } from "../services/meeting.service.js"

export async function syncCalendar(req: Request, res: Response) {
  const bedgNumber = Number(req.query.userID);
  const refresh_token = req.body.refresh_token;

  await syncUserCalendar(bedgNumber, refresh_token);
  res.json({ message: 'success' });
}

export async function syncActiveUsers(req: Request, res: Response) {
  await syncAllActiveUsers();
  res.json({ message: 'success' });
}