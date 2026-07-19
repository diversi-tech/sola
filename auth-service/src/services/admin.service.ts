import { supabaseAdmin } from '../config/supabase.js';

export const adminService = {
  getAllPermissions: async () => {
    const { data, error } = await supabaseAdmin
      .from('permissions')
      .select('id, name, description');
      
    if (error) throw error;
    return data;
  },

  getEmployeesWithPermissions: async () => {
    const { data, error } = await supabaseAdmin
      .from('Employees')
      .select(`
        id,
        name,
        employee_permissions (
          permission_id
        )
      `);

    if (error) throw error;

    const formattedData = data.map((emp: any) => ({
      id: emp.id,
      name: emp.name,
      permissions: emp.employee_permissions.map((ep: any) => ep.permission_id)
    }));
    return formattedData;
  },

  updateEmployeePermissions: async (employeeId: number, permissionIds: number[]) => {
    const { error: deleteError } = await supabaseAdmin
      .from('employee_permissions')
      .delete()
      .eq('employee_id', employeeId);

    if (deleteError) throw deleteError;

    if (permissionIds.length > 0) {
      const insertData = permissionIds.map(permissionId => ({
        employee_id: employeeId,
        permission_id: permissionId
      }));

      const { error: insertError } = await supabaseAdmin
        .from('employee_permissions')
        .insert(insertData);

      if (insertError) throw insertError;
    }
  }
};