export type MeetingType = 'Frontal team meeting' | 'Online team meeting' | 'Online personal meeting' | 'Frontal personal meeting';
export interface Meeting {
  meeting_id?: number;
  title: string;
  type: MeetingType;
  CreatedAt: string;        // datetime - מתי הפגישה נוצרה
  CreatedTo: string;  
  Estimated_duration_minutes: number;      // משך זמן משוער בדקות
  ParticipantsCount: number;
  ManagerID?: number;
  CalendarID: number;       // המספר האישי של העובד
  StartTime?: string;        
  EndTime?: string;          
  Actual_time?: string;       // משך זמן בפועל (יכול להיות שונה מהמשוער)
  EfficiencyScore?:number;
}
