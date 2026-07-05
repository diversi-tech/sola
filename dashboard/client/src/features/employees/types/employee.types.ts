export interface Employee {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Meeting {
  meeting_id: number;
  title: string | null;
  type: string | null;
  start_time: string | null;
  end_time: string | null;
  estimated_duration_minutes: number | null;
  participants_count: number | null;
  attendees: string[] | null;
}

export interface Report {
  id: number;
  created_at: string;
  employee_id: number;
  manager_id: number;
  text_summary: string;
  audio_link: string | null;
  metric_scores: Record<string, number>;
}

export interface EmployeeWithReports {
  employee: Employee;
  reports: Report[];
  latest_report_date: string;
}

export interface Category {
  id: number;
  name: string;
}
