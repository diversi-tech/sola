import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
dotenv.config(); 

// Fallback to mock project for local development if env variables are missing
// temporary until we connect to supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';
const serviceRole = process.env.SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucXRsZHNmd2NuYW14c2lpenpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4MDYzNiwiZXhwIjoyMDk2NjU2NjM2fQ.uUsCXaVCZCX-yr4VvgKqCxhtWm0Ztm43kk7-Y4zKCF0'

export const supabase = createClient(supabaseUrl, serviceRole);