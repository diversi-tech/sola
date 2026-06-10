
// 1. מעקפי רשת ותעודות אבטחה לסביבת הפיתוח
// ==========================================
// מאפשר ל-Node.js לעקוף חסימות תעודת אבטחה מקומיות (של סינוני אינטרנט) ב-Fetch
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// מכריח את Node.js לתת עדיפות לכתובות IPv4 כדי למנוע שגיאות "fetch failed" ברשתות ביתיות
import dns from 'dns';
if (dns && dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// ==========================================
// 2. ייבוא האפליקציה והגדרת השרת
// ==========================================
import app from './app.js';
import * as dotenv from 'dotenv';

// טעינת משתני סביבה (למקרה שנרצה להשתמש בפורט מה-.env)
dotenv.config();

// הגדרת הפורט שעליו ירוץ השרת (ברירת מחדל 3000 אם לא הוגדר ב-.env)
const PORT = process.env.PORT || 3000;

// הפעלת השרת והקשבה לבקשות נכנסות
app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 השרת רץ בהצלחה ומחובר ל-Supabase!`);
  console.log(`🌍 זמין בכתובת המקומית: http://localhost:${PORT}`);
  console.log('==================================================');
});