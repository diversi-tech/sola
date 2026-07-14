import { supabase } from '../config/supabase.js';

export const verifyAndFindOauthEmployee = async (email: string) => {
  if (!email) {
    throw new Error("No email address provided.");
  }

  const { data: existingEmployee, error: searchError } = await supabase
    .from('Employees')
    .select('*')
    .eq('Email', email) 
    .single();

  if (searchError && searchError.code !== 'PGRST116') {
    throw new Error(`Error searching for employee: ${searchError.message}`);
  }

  if (!existingEmployee) {
    return null; 
  }

  return existingEmployee;
};

export const getEmployeeById = async (id: number) => { 
  const { data, error } = await supabase
    .from('Employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
};