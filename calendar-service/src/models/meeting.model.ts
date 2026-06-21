//meeting.model.ts
export type MeetingType = 'Frontal team meeting' | 'Online team meeting' | 'Online personal meeting' | 'Frontal personal meeting';
export interface Meeting {
  meeting_id?: number;
  title: string;
  type: MeetingType;
  created_at: string;        
  created_to: string;  
  estimated_duration_minutes: number;     
  participants_count: number;
  manager_id?: number;
  calendar_id: number;     
  start_time?: string;        
  end_time?: string;          
  actual_time?: string|null;      
  efficiency_score?:number;
  attendees: string[];
    google_event_id?: string; 

}
