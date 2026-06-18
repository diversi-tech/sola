import 'dotenv/config';
import express from 'express';
// import meetingRoutes from './routes/meeting.routes';
// import { errorHandler } from './middleware/error.middleware';

import calendarAuthRoutes from './routes/calendarAuth.route.js';
import { supabase } from './config/supabase.js';

const app = express();

// מאפשר לשרת לקרוא ולקבל גוף בקשה (body) בפורמט JSON
app.use(express.json());

// נתיב בסיסי לבדיקה שהשרת מגיב בדפדפן
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// חיבור נתיבי הפגישות לאפליקציה
// app.use('/api/meetings', meetingRoutes);

// חיבור הראוטים של ה-Calendar Auth שהגדרנו
app.use('/api/calendar', calendarAuthRoutes);

// חיבור תופס השגיאות הגלובלי של האפליקציה (מומלץ שיהיה אחרי הראוטים)
// app.use(errorHandler);

// פונקציית בדיקת החיבור ל-Supabase
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

// הרצת פונקציית הבדיקה באתחול
testConnection();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ ומקשיב על פורט ${PORT}`);
});

export default app;