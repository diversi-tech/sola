export interface IEmployee {
  id: number;
  name: string;
  is_active: boolean;
}
export interface IReportCategory {
  id: number;
  name: string;
}
export interface IReport {
  id: number;
  created_at: string;
  employee_id: number;
  manager_id: number;
  text_summary: string;
  audio_link: string | null;
  metric_scores: Record<string, any>; // מתאים לשדה jsonb
}
export interface IMeeting {
  meeting_id: number;
  title: string | null;
  type: string | null; // מניח שהטיפוס המותאם public.meeting_type חוזר כטקסט
  created_at: string | null;
  created_to: string | null;
  estimated_duration_minutes: number | null;
  participants_count: number | null;
  start_time: string | null;
  end_time: string | null;
  actual_time: number | null;
  efficiency_score: number | null;
  manager_id: number | null;
  calendar_id: number | null;
  attendees: string[] | null; // מערך של מחרוזות
}
export interface IAuthorizedUser {
  user_id: string;
  phone_number: string;
}