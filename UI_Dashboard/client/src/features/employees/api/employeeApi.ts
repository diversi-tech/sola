// src/components/employee/services/employeeApi.ts

export interface Employee {
  id: number;
  name: string;
  is_active: boolean;
  rating?: number; 
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

export const calculateEmployeeRating = (reports: Report[]): number => {
  if (!reports || reports.length === 0) return 0;
  let totalScore = 0;
  let count = 0;

  reports.forEach(report => {
    const scores = Object.values(report.metric_scores);
    scores.forEach(score => {
      totalScore += score;
      count++;
    });
  });

  return count > 0 ? Math.round((totalScore / count) / 20) : 0; // מניח שהציון הוא מתוך 100 וממיר ל-5 כוכבים
};

export const employeeApi = {
  fetchAllEmployees: async (): Promise<Employee[]> => {
    const URL = 'http://localhost:5006/api/employees'; 
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  fetchEmployeeReports: async (employeeId: number): Promise<Report[]> => {
    const URL = `http://localhost:5006/api/reports/${employeeId}`; 
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  }
};