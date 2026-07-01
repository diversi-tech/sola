import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log("DEBUG - URL:", process.env.SUPABASE_URL);
console.log("DEBUG - KEY:", process.env.SUPABASE_ANON_KEY);

export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://bnqtldsfwcnamxsiizzg.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'sb_secret_mUYIOWneHIfWDFyEL3jfyA_b37tKSXR'
);


