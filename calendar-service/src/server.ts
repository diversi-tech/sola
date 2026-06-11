import { supabase } from './config/supabase.js';

async function testConnection() {
  try {
    const { data, error } = await supabase.from('Meeting').select('*');
    if (error) {
      console.log('❌ החיבור נכשל (object):', error);
      try {
        console.log('❌ פרטי שגיאה:', JSON.stringify(error));
      } catch (_) {}
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

