import { supabase } from '../config/supabase.js';

let whatsappPermissionId: number | null = null;

const getWhatsappPermissionId = async (): Promise<number | null> => {
  if (whatsappPermissionId !== null) {
    return whatsappPermissionId; 
  }

  const { data, error } = await supabase
    .from('permissions')
    .select('id')
    .eq('name', 'SEND_WHATSAPP_MESSAGES')
    .single();

  if (error) throw new Error(`Failed to fetch permission ID: ${error.message}`);
  
  whatsappPermissionId = data.id; 
  return whatsappPermissionId;
};

export const getUserByPhone = async (phone_number: string) => {
  const { data: employee, error: empError } = await supabase
    .from('Employees')
    .select('id, name')
    .eq('Phone number', phone_number)
    .maybeSingle();

  if (empError) throw new Error(`Employee query error: ${empError.message}`);
  if (!employee) return null;

  const permissionId = await getWhatsappPermissionId();

  const { data: hasPermission, error: permError } = await supabase
    .from('employee_permissions')
    .select('id')
    .eq('employee_id', employee.id)
    .eq('permission_id', permissionId)
    .maybeSingle();

  if (permError) throw new Error(`Permission query error: ${permError.message}`);

  return hasPermission ? employee : null;
};

export const authenticateUser = async (phone_number: string) => {
  const user = await getUserByPhone(phone_number);
  return user; 
};