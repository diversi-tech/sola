import { supabaseAdmin } from '../config/supabase.js';

let whatsappPermissionId: number | null = null;

const getWhatsappPermissionId = async (): Promise<number | null> => {
  if (whatsappPermissionId !== null) {
    return whatsappPermissionId; 
  }
  const { data, error } = await supabaseAdmin
    .from('permissions')
    .select('id')
    .eq('name', 'SEND_WHATSAPP_MESSAGES')
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch permission ID: ${error.message}`);

  whatsappPermissionId = data?.id ?? null;
  return whatsappPermissionId;
};

export const getEmployeeByPhoneNumber = async (phone_number: string) => {
  const { data: employees, error: empError } = await supabaseAdmin
    .from('Employees')
    .select('id, name')
    .eq('phone_number', phone_number);

  if (empError) throw new Error(`Employee query error: ${empError.message}`);
  if (!employees || employees.length === 0) return null;

  if (employees.length > 1) {
    console.error(
      `Multiple employees share phone number ${phone_number} (ids: ${employees.map((e) => e.id).join(', ')}). Denying authorization until the duplicate is resolved.`
    );
    return null;
  }

  const employee = employees[0];

  const permissionId = await getWhatsappPermissionId();
  if (permissionId === null) return null;

  const { data: hasPermission, error: permError } = await supabaseAdmin
    .from('employee_permissions')
    .select('employee_id')
    .eq('employee_id', employee.id)
    .eq('permission_id', permissionId);
  if (permError) throw new Error(`Permission query error: ${permError.message}`);

  return hasPermission && hasPermission.length > 0 ? employee : null;
};

export const authenticateUser = async (phone_number: string) => {
  const user = await getEmployeeByPhoneNumber(phone_number);
  return user; 
};