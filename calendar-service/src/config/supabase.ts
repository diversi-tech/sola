import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// טעינת משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables.');
}

// יצירת קליינט החיבור וייצוא שלו לשימוש בשאר חלקי האפליקציה
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
