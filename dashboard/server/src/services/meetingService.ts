import { supabase } from '../config/supabaseClient.js';
import { IMeeting } from '../types/database.types.js';

export const meetingService = {
  // שליפת כל הפגישות
  async getAllMeetings(): Promise<IMeeting[]> {
    const { data, error } = await supabase
      .from('Meeting')
      .select('*');

    if (error) {
      throw new Error(`שגיאה בשליפת פגישות: ${error.message}`);
    }

    return data as IMeeting[];
  },

  // שליפת פגישה בודדת לפי מזהה הפגישה
  async getMeetingById(meetingId: number): Promise<IMeeting> {
    const { data, error } = await supabase
      .from('Meeting')
      .select('*')
      .eq('meeting_id', meetingId) // חשוב! חיפוש לפי העמודה הנכונה
      .single();

    if (error) {
      throw new Error(`שגיאה בשליפת פגישה: ${error.message}`);
    }

    return data as IMeeting;
  },

  // שליפת כל הפגישות לפי מזהה עובד
  async getMeetingsByEmployee(employeeId: number): Promise<IMeeting[]> {
    const { data, error } = await supabase
      .from('Meeting')
      .select('*')
      .eq('calendar_id', employeeId)
      .order('start_time', { ascending: true });

    if (error) {
      throw new Error(`שגיאה בשליפת פגישות עובד: ${error.message}`);
    }

    return (data ?? []) as IMeeting[];
  }
};