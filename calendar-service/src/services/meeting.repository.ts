import { supabase } from '../config/supabase.js';
import { Meeting } from '../models/meeting.model.js';

export async function validateEmployeeAndToken(
  employee_id: number,
  refreshToken: string
): Promise<{ valid: boolean; error?: string }> {
  const { data: employee, error: employeeError } = await supabase
    .from('Employee_token')
    .select('id, refresh_token')
    .eq('id', employee_id)
    .single();

  if (employeeError || !employee) {
    return {
      valid: false,
      error: `Employee with ID ${employee_id} does not exist in the system.`,
    };
  }

  if (employee.refresh_token !== refreshToken) {
    return {
      valid: false,
      error: `Provided refresh token does not match the system record for this employee.`,
    };
  }

  return { valid: true };
}

export async function saveMeetings(meetings: Meeting[]): Promise<void> {
  if (meetings.length === 0) {
    return;
  }

  const { error: dbError } = await supabase
    .from('Meeting')
    .upsert(meetings, { onConflict: 'google_event_id' });

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }
}

export async function getAllActiveEmployees(): Promise<
  Array<{ id: number; employee_email: string; refresh_token: string }>
> {
  const { data: employees, error } = await supabase
    .from('Employee_token')
    .select('id, employee_email, refresh_token')
    .not('refresh_token', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }
  
  return employees ?? [];
}
 
export async function getAllMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('Meeting')
    .select('*');

  if (error) {
    throw new Error(`Failed to fetch meetings: ${error.message}`);
  }

  return data ?? [];
}

export async function getAuthStatusesByEmails(
  emails: string[]
): Promise<Record<string, 'ACTIVE' | 'INACTIVE'>> {
  if (emails.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from('Employee_token')
    .select('employee_email, status')
    .in('employee_email', emails);

  if (error) {
    throw new Error(`Failed to fetch auth statuses: ${error.message}`);
  }

  const statusMap: Record<string, 'ACTIVE' | 'INACTIVE'> = {};
  for (const row of data ?? []) {
    statusMap[row.employee_email] = row.status;
  }

  return statusMap;
}

export async function revokeAuthByEmail(employeeEmail: string): Promise<void> {
  const { error } = await supabase
    .from('Employee_token')
    .update({ status: 'INACTIVE', refresh_token: null })
    .eq('employee_email', employeeEmail)
    .eq('status', 'ACTIVE');

  if (error) {
    throw new Error(`Failed to revoke access: ${error.message}`);
  }
}
