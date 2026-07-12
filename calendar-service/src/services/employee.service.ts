import { supabase } from '../config/supabase.js';

export const employeeService = {

  async getEmployeeMeetings(email: string ): Promise<any[]> {
    const { data, error } = await supabase
      .from('Meeting')
      .select('*')
      .contains('attendees', [email])
      ;

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getCreatedMeetingsByEmployee(employeeId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from('Meeting')
      .select('*')
      .eq('calendar_id', employeeId);

    if (error) throw new Error(error.message);
    return data || [];
  }
};