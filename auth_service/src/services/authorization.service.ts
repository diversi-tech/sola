import { supabase } from '../config/supabase.js';

const getUserByPhone = async (phoneNumber: string) => {
  const { data, error } = await supabase
    .from('Users')
    .select('ID')
    .eq('PhoneNumber', phoneNumber)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  return data;
};

export const authenticateUser = async (phoneNumber: string) => {
  const user = await getUserByPhone(phoneNumber);

  return user; 
};