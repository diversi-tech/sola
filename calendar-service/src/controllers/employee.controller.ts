import { Request, Response } from 'express';
import { employeeService } from '../services/employee.service.js';

export const employeeController = {
  getMeetingsByAttendee: async (req: Request<{ email: string }>, res: Response) => {
    try {
      const { email } = req.params;
      const meetings = await employeeService.getEmployeeMeetings(email);
      res.json(meetings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getCreatedMeetings: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const employeeId = parseInt(req.params.id);
      const meetings = await employeeService.getCreatedMeetingsByEmployee(employeeId);
      res.json(meetings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};