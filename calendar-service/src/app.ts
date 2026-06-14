import express from 'express';
// import meetingRoutes from './routes/meeting.routes';
// import { errorHandler } from './middleware/error.middleware';

const app = express();

// מאפשר לשרת לקרוא ולקבל גוף בקשה (body) בפורמט JSON
app.use(express.json());

// נתיב בסיסי לבדיקה שהשרת מגיב בדפדפן
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// חיבור נתיבי הפגישות לאפליקציה (זמנית יכול להיות כבוי אם הקובץ meeting.routes ריק)
// app.use('/api/meetings', meetingRoutes);

// חיבור תופס השגיאות הגלובלי של האפליקציה
// app.use(errorHandler);
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

// השורה הכי חשובה שפתרה את השגיאה שלכן!
export default app;