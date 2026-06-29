import { supabase } from '../config/supabase.js';

export const findOrCreateGoogleUser = async (profile: any) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

  if (!email) {
    throw new Error("No email address found in Google Account.");
  }

  const { data: existingUser, error: searchError } = await supabase
    .from('Users')
    .select('*')
    .eq('employee_email', email)
    .single();

  if (searchError && searchError.code !== 'PGRST116') {
    throw new Error(`Error searching for user: ${searchError.message}`);
  }

  if (existingUser) {
    return existingUser;
  }

  const { data: newUser, error: insertError } = await supabase
    .from('Users')
    .insert([
      { employee_email: email }
    ])
    .select() 
    .single();

  if (insertError) {
    throw new Error(`Error creating user: ${insertError.message}`);
  }

  return newUser;
};

export const getUserById = async (id: number) => { 
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
};