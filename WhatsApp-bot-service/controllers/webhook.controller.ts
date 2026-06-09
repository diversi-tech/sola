import { Request, Response } from 'express';
import { checkVerifyToken, processWebhookEvent } from '../services/webhook.service';

// פונקציה לבקשת GET (אימות)
export const verifyWebhook = (req: Request, res: Response) => {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    if (mode && token) {
        // קריאה לשכבת ה-Service כדי לבדוק אם הטוקן תקין
        const isValid = checkVerifyToken(mode, token);
        
        if (isValid) {
            console.log('✅ Webhook verified successfully!');
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
};

// פונקציה לבקשת POST (קבלת הודעות)
export const receiveWebhookEvent = (req: Request, res: Response) => {
    const body = req.body;

    // העברת המידע של ההודעה ל-Service שיטפל בה (בלי לחסום את התשובה למטא)
    processWebhookEvent(body);

    // חובה להחזיר 200 מיד כדי שמטא ידעו שההודעה התקבלה ולא ישלחו אותה שוב
    res.status(200).send('EVENT_RECEIVED');
};