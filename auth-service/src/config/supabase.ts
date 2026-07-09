import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
dotenv.config(); 

// Fallback to mock project for local development if env variables are missing
// temporary until we connect to supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';
const serviceRole = process.env.SERVICE_ROLE as string

export const supabase = createClient(supabaseUrl, serviceRole);