import { Request, Response } from 'express';
import { employeeService } from '../services/employeeService.js';

export const employeeController = {
  // קונטרולר לשליפת כל העובדים
  async getAllEmployees(req: Request, res: Response) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.status(200).json({ success: true, data: employees });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // קונטרולר לשליפת עובד לפי ID
  async getEmployeeById(req: Request, res: Response) {
    try {
      // חילוץ ה-ID מה-URL והמרתו למספר
      const employeeId = parseInt(req.params.id as string, 10);
      if (isNaN(employeeId)) {
        return res.status(400).json({ success: false, message: "ID חייב להיות מספר תקין" });
      }

      const employee = await employeeService.getEmployeeById(employeeId);
      res.status(200).json({ success: true, data: employee });
    } catch (error: any) {
      // Supabase מחזיר שגיאה אם לא נמצאה רשומה ב-single()
      if (error.message.includes('Row not found') || error.message.includes('שגיאה בשליפת עובד')) {
        return res.status(404).json({ success: false, message: "העובד לא נמצא" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};