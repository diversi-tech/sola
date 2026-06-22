import { supabase } from '../config/supabaseClient.js';
import { IReportCategory } from '../types/database.types.js';

export const reportCategoryService = {
  // שליפת כל הקטגוריות
  async getAllCategories(): Promise<IReportCategory[]> {
    // שימי לב: אם יש שגיאת URL כמו מקודם, נסי לשנות פה ל-'reportcategory' (הכל באותיות קטנות)
    const { data, error } = await supabase
      .from('ReportCategory')
      .select('*');

    if (error) {
      throw new Error(`שגיאה בשליפת קטגוריות: ${error.message}`);
    }

    return data as IReportCategory[];
  },

  // שליפת קטגוריה בודדת לפי ID
  async getCategoryById(id: number): Promise<IReportCategory> {
    const { data, error } = await supabase
      .from('ReportCategory')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`שגיאה בשליפת קטגוריה: ${error.message}`);
    }

    return data as IReportCategory;
  }
};