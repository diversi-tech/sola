import { supabase } from '../config/supabaseClient.js';
import { IReport } from '../types/database.types.js';

export const reportService = {
  // שליפת כל הדוחות
  async getAllReports(): Promise<IReport[]> {
    // שימי לב לאותיות רישיות/קטנות בשם הטבלה מול Supabase
    const { data, error } = await supabase
      .from('Reports')
      .select('*');

    if (error) {
      throw new Error(`שגיאה בשליפת דוחות: ${error.message}`);
    }

    return data as IReport[];
  },

  // שליפת דוח בודד לפי ID
  async getReportById(id: number): Promise<IReport[]> {
    const { data, error } = await supabase
      .from('Reports')
      .select('*')
      .eq('employee_id', id);

    if (error) {
      throw new Error(`שגיאה בשליפת דוח: ${error.message}`);
    }

    return data as IReport[];
  }
};