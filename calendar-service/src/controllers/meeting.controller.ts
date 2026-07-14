import { Request, Response } from "express"
import { syncAllActiveEmployees, syncEmployeeCalendar } from "../services/meeting.service.js"

export async function syncCalendar(req: Request, res: Response) {
  const employee_id = Number(req.query.userID);
  const refresh_token = req.body.refresh_token;

  await syncEmployeeCalendar(employee_id, refresh_token);
  res.json({ message: 'success' });
}

export async function syncActiveEmployees(req: Request, res: Response) {
  await syncAllActiveEmployees();
  res.json({ message: 'success' });
}