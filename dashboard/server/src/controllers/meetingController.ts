import { Request, Response } from 'express';
import { meetingService } from '../services/meetingService.js';

export const meetingController = {
  // שליפת כל הפגישות
  async getAllMeetings(req: Request, res: Response) {
    try {
      const meetings = await meetingService.getAllMeetings();
      res.status(200).json({ success: true, data: meetings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // שליפת פגישה ספציפית
  async getMeetingById(req: Request, res: Response) {
    try {
      const meetingId = parseInt(req.params.id as string, 10);
      if (isNaN(meetingId)) {
        return res.status(400).json({ success: false, message: "מזהה פגישה חייב להיות מספר תקין" });
      }

      const meeting = await meetingService.getMeetingById(meetingId);
      res.status(200).json({ success: true, data: meeting });
    } catch (error: any) {
      if (error.message.includes('Row not found') || error.message.includes('שגיאה בשליפת פגישה')) {
        return res.status(404).json({ success: false, message: "הפגישה לא נמצאה" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};