import { supabase } from '../config/supabase.js';

const getUserByPhone = async (phone_number: string) => {
  const { data, error } = await supabase
    .from('Authorized_Users')
    .select('user_id')
    .eq('phone_number', phone_number)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  return data;
};

export const authenticateUser = async (phone_number: string) => {
  const user = await getUserByPhone(phone_number);

  return user; 
};