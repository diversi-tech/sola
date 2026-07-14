import { getAuthHeaders } from '../../../lib/authHeaders';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface EmployeeWithPermissions {
  id: number;
  name: string;
  permissions: number[]; 
}

export const adminApi = {
  fetchPermissions: async (): Promise<Permission[]> => {
    const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/admin/permissions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch permissions');
    const result = await response.json();
    return result.data ?? result;
  },

  fetchEmployees: async (): Promise<EmployeeWithPermissions[]> => {
    const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/admin/employees`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch employees');
    const result = await response.json();
    return result.data ?? result;
  },

  updateEmployeePermissions: async (employeeId: number, permissionIds: number[]): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/admin/employees/${employeeId}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ permissions: permissionIds }),
    });
    if (!response.ok) throw new Error('Failed to update permissions');
  },
};