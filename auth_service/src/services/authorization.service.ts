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

export const isUserAuthorized = async (phoneNumber: string): Promise<boolean> => {
  const user = await getUserByPhone(phoneNumber);
  
  return user !== null;
};