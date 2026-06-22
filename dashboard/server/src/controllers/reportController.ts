import { Request, Response } from 'express';
import { reportService } from '../services/reportService.js';

export const reportController = {
  // קונטרולר לשליפת כל הדוחות
  async getAllReports(req: Request, res: Response) {
    try {
      const reports = await reportService.getAllReports();
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // קונטרולר לשליפת דוח לפי ID
  async getReportById(req: Request, res: Response) {
    try {
      const reportId = parseInt(req.params.id as string, 10);
      if (isNaN(reportId)) {
        return res.status(400).json({ success: false, message: "ID חייב להיות מספר תקין" });
      }

      const report = await reportService.getReportById(reportId);
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      if (error.message.includes('Row not found') || error.message.includes('שגיאה בשליפת דוח')) {
        return res.status(404).json({ success: false, message: "הדוח לא נמצא" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};