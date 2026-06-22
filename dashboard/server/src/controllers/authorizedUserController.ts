import { Request, Response } from 'express';
import { authorizedUserService } from '../services/authorizedUserService.js';

export const authorizedUserController = {
  // שליפת כל המשתמשים המורשים
  async getAllAuthorizedUsers(req: Request, res: Response) {
    try {
      const users = await authorizedUserService.getAllAuthorizedUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // שליפת משתמש מורשה לפי ID (UUID)
  async getAuthorizedUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id; // אין צורך ב-parseInt!
      
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ success: false, message: "מזהה משתמש לא תקין" });
      }

      const user = await authorizedUserService.getAuthorizedUserById(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      if (error.message.includes('Row not found') || error.message.includes('שגיאה בשליפת משתמש מורשה')) {
        return res.status(404).json({ success: false, message: "משתמש מורשה לא נמצא" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};