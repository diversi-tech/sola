import { Employee, Report, EmployeeWithReports, Meeting, Category } from '../types/employee.types';
export const calculateEmployeeRating = (reports: Report[]): number => {
  if (!reports || reports.length === 0) return 0;
  let totalScore = 0;
  let count = 0;
  reports.forEach(report => {
    Object.values(report.metric_scores).forEach(score => {
      totalScore += score;
      count++;
    });
  });
  return count > 0 ? Math.round((totalScore / count) ) : 0;
};

export const employeeApi = {
  fetchEmployeesWithReports: async (): Promise<EmployeeWithReports[]> => {
    const URL = `${import.meta.env.VITE_REPORT_SERVICE_URL}/api/reports/by-employee`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Failed to fetch employees with reports');
    const result = await response.json();
    return result.data ?? result;
  },

  fetchEmployeeMeetings: async (employeeId: number, employeeEmail: string): Promise<Meeting[]> => {
  const baseURL = import.meta.env.VITE_CALENDAR_SERVICE_URL;
 
  const [attendeeRes, createdRes] = await Promise.all([
    fetch(`${baseURL}/api/employees/meetings/attendee/${employeeEmail}`),
    fetch(`${baseURL}/api/employees/${employeeId}/created-meetings`),
  ]);

  if (!attendeeRes.ok) throw new Error('Failed to fetch attendee meetings');
  if (!createdRes.ok) throw new Error('Failed to fetch created meetings');

  const attendeeData = await attendeeRes.json();
  const createdData = await createdRes.json();

  const attendeeMeetings: Meeting[] = attendeeData.data ?? attendeeData;
  const createdMeetings: Meeting[] = createdData.data ?? createdData;

  const merged = new Map<number, Meeting>();
  [...attendeeMeetings, ...createdMeetings].forEach((m) => {
    merged.set(m.meeting_id, m);
  });

  return Array.from(merged.values());
},

  fetchCategories: async (): Promise<Category[]> => {
    const URL = `${import.meta.env.VITE_REPORT_SERVICE_URL}/api/categories`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const result = await response.json();
    return result.data ?? result;
  },
};