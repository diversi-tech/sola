import { supabase } from '../config/supabaseClient.js';
import { IAuthorizedUser } from '../types/database.types.js';

export const authorizedUserService = {
  // שליפת כל המשתמשים המורשים
  async getAllAuthorizedUsers(): Promise<IAuthorizedUser[]> {
    const { data, error } = await supabase
      .from('Authorized_Users')
      .select('*');

    if (error) {
      throw new Error(`שגיאה בשליפת משתמשים מורשים: ${error.message}`);
    }

    return data as IAuthorizedUser[];
  },

  // שליפת משתמש מורשה בודד לפי מזהה (UUID)
  async getAuthorizedUserById(userId: string): Promise<IAuthorizedUser> {
    const { data, error } = await supabase
      .from('Authorized_Users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`שגיאה בשליפת משתמש מורשה: ${error.message}`);
    }

    return data as IAuthorizedUser;
  }
};