import { createClient } from '@supabase/supabase-js';

// הנתונים האלו יגיעו מקובץ ה-.env שלכן בעתיד
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';

// יצירת הקליינט שדרכו נדבר עם הדאטהבייס
export const supabase = createClient(supabaseUrl, supabaseKey);