import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../config/supabase.js';

export const verifyAndFindOauthEmployee = async (email: string) => {
  if (!email) {
    throw new Error("No email address provided.");
  }

  const { data: existingEmployee, error: searchError } = await supabaseAdmin
    .from('Employees')
    .select('*')
    .eq('email', email)
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
  const { data, error } = await supabaseAdmin
    .from('Employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
};

export const issueSupabaseSessionForEmployee = async (email: string) => {
  // For 'magiclink', Supabase creates the Auth user if it doesn't exist yet,
  // so this also provisions login for employees added straight to the DB.
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (linkError || !linkData?.properties?.hashed_token || !linkData.user) {
    throw new Error(`Could not generate a login session for ${email}: ${linkError?.message ?? 'no token returned'}`);
  }

  // Keep the employee's auth_id aligned with the real Supabase Auth user so
  // password login and permission checks resolve to the same identity.
  await supabaseAdmin
    .from('Employees')
    .update({ auth_id: linkData.user.id })
    .eq('email', email);

  // verifyOtp mutates its client's session; use a throwaway client so concurrent
  // logins don't clobber the shared one.
  const ephemeral = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || '',
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: otpData, error: otpError } = await ephemeral.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });

  if (otpError || !otpData.session) {
    throw new Error(`Could not establish a session for ${email}: ${otpError?.message ?? 'no session returned'}`);
  }

  return otpData.session;
};