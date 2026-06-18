//meeting.model.ts
export type MeetingType = 'Frontal team meeting' | 'Online team meeting' | 'Online personal meeting' | 'Frontal personal meeting';
export interface Meeting {
  meeting_id?: number;
  title: string;
  type: MeetingType;
  created_at: string;        // datetime - מתי הפגישה נוצרה
  created_to: string;  
  estimated_duration_minutes: number;      // משך זמן משוער בדקות
  participants_count: number;
  manager_id?: number;
  calendar_id: number;       // המספר האישי של העובד
  start_time?: string;        
  end_time?: string;          
  actual_time?: string|null;       // משך זמן בפועל (יכול להיות שונה מהמשוער)
  efficiency_score?:number;
  attendees: string[];      // רשימת המשתתפים בפגישה
    google_event_id?: string; // ← חדש

}
