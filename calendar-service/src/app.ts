import express from 'express';
import meetingRoutes from './routes/meeting.routes';
import { errorHandler } from './middleware/error.middleware';

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
app.use(errorHandler);

// השורה הכי חשובה שפתרה את השגיאה שלכן!
export default app;