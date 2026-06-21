import { Request, Response } from 'express';
import { processGoogleCallback } from '../services/meeting.service.js';

export const googleCallbackHandler = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        const state = req.query.state as string;
        const error = req.query.error as string;

        if (!code && !error) {
            return res.status(400).json({ message: "בקשה לא תקינה - חסרים נתונים מגוגל." });
        }

        await processGoogleCallback(code, state, error);

        return res.status(200).send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                <h1 style="color: #2ecc71;">החיבור ל-Google Calendar הצליח! 🎉</h1>
                <p>היומן שלך סונכרן בהצלחה למערכת Sola. המידע הוצפן ונשמר בבטחה. אפשר לסגור את הלשונית הזו עכשיו.</p>
            </div>
        `);

    } catch (err: any) {
        console.error("Callback endpoint error:", err.message);
        
        switch (err.message) {
            case "USER_DENIED":
                return res.status(400).json({ message: "החיבור נדחה. לא ניתן לגשת ליומן." });
            case "SECURITY_ERROR":
                return res.status(401).json({ message: "שגיאת אבטחה: הבקשה לא חוקית או שפג תוקפה." });
            case "GOOGLE_API_ERROR":
            case "NO_REFRESH_TOKEN":
                return res.status(500).json({ message: "שגיאה מול גוגל בהמרת הקוד." });
            case "DB_SAVE_ERROR":
                return res.status(500).json({ message: "שגיאה בשמירת הנתונים במערכת." });
            default:
                return res.status(500).json({ message: "שגיאת שרת פנימית." });
        }
    }
};