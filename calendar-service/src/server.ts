import { supabase } from './config/supabase.js';

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users_profile').select('*');
    if (error) {
      console.log('❌ החיבור נכשל:', error.message ?? error);
      return;
    }
    console.log('✅ החיבור הצליח');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log('❌ החיבור נכשל:', msg);
  }
}

// הרצת פונקציית הבדיקה
testConnection();