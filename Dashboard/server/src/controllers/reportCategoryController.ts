import { Request, Response } from 'express';
import { reportCategoryService } from '../services/reportCategoryService.js';

export const reportCategoryController = {
  // קונטרולר לשליפת כל הקטגוריות
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await reportCategoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // קונטרולר לשליפת קטגוריה לפי ID
  async getCategoryById(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.id as string, 10);

      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: "ID חייב להיות מספר תקין" });
      }

      const category = await reportCategoryService.getCategoryById(categoryId);
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      if (error.message.includes('Row not found') || error.message.includes('שגיאה בשליפת קטגוריה')) {
        return res.status(404).json({ success: false, message: "הקטגוריה לא נמצאה" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};