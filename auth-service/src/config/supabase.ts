import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
dotenv.config(); 

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';
const supabaseKey = process.env.SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
