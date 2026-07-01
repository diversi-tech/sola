
export interface Employee {
  id: number;
  name: string;
  is_active: boolean;
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

  return count > 0 ? Math.round((totalScore / count) / 20) : 0;
};

export const employeeApi = {
  fetchEmployeesWithReports: async (): Promise<EmployeeWithReports[]> => {
    const URL = `${import.meta.env.VITE_REPORT_SERVICE_URL}/api/reports/by-employee`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Failed to fetch employees with reports');
    const result = await response.json();
    return result.data ?? result;
  },
};
