import { supabase } from '../config/supabaseClient.js'; // ודאי שהנתיב תואם לקובץ שלך
import { IEmployee } from '../types/database.types.js';

export const employeeService = {
  // שליפת כל העובדים
  async getAllEmployees(): Promise<IEmployee[]> {
    const { data, error } = await supabase
      .from('Employees')
      .select('*');

    if (error) {
      throw new Error(`שגיאה בשליפת עובדים: ${error.message}`);
    }

    return data as IEmployee[];
  },

  // שליפת עובד ספציפי לפי ID
  async getEmployeeById(id: number): Promise<IEmployee> {
    const { data, error } = await supabase
      .from('Employees')
      .select('*')
      .eq('id', id)
      .single(); // מבטיח שנקבל אובייקט אחד ולא מערך

    if (error) {
      throw new Error(`שגיאה בשליפת עובד: ${error.message}`);
    }

    return data as IEmployee;
  }
};