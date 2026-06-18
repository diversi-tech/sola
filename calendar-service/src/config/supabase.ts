import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
// טעינת משתני הסביבה מקובץ .env
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSetviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseSetviceRoleKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables.');
}
// יצירת קליינט החיבור וייצוא שלו לשימוש בשאר חלקי האפליקציה
export const supabase = createClient(supabaseUrl, supabaseSetviceRoleKey);