import { EmployeeWithReports, Meeting, Category } from '../types/employee.types';
import { getAuthHeaders } from '../../../lib/authHeaders';

export const employeeApi = {
  fetchEmployeesWithReports: async (): Promise<EmployeeWithReports[]> => {
    const URL = `${import.meta.env.VITE_REPORT_SERVICE_URL}/api/reports/by-employee`;
    const response = await fetch(URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch employees with reports');
    const result = await response.json();
    return result.data ?? result;
  },

  fetchEmployeeMeetings: async (employeeId: number, employeeEmail: string): Promise<Meeting[]> => {
  const baseURL = import.meta.env.VITE_CALENDAR_SERVICE_URL;
 
  const [attendeeRes, createdRes] = await Promise.all([
    fetch(`${baseURL}/api/employees/meetings/attendee/${employeeEmail}`, { headers: getAuthHeaders() }),
    fetch(`${baseURL}/api/employees/${employeeId}/created-meetings`, { headers: getAuthHeaders() }),
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

fetchAllMeetings: async (): Promise<Meeting[]> => {
  const URL = `${import.meta.env.VITE_CALENDAR_SERVICE_URL}/api/meetings`;
  const response = await fetch(URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch all meetings');
  const result = await response.json();
  return result.data ?? result;
},
  
fetchCategories: async (): Promise<Category[]> => {
    const URL = `${import.meta.env.VITE_REPORT_SERVICE_URL}/api/categories`;
    const response = await fetch(URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const result = await response.json();
    return result.data ?? result;
  },
};