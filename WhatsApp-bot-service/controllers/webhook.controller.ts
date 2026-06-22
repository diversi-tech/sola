import { Request, Response } from 'express';
import { checkVerifyToken, processWebhookEvent, sendWhatsAppMessage } from '../services/webhook.services';

const handleUnauthorizedAccess = async (res: Response, phoneNumber: string) => {
    await sendWhatsAppMessage(phoneNumber, "Sorry, you are not authorized to use this bot.");
    return res.status(200).send('EVENT_RECEIVED');
};
// GET (verify webhook with Meta)
export const verifyMetaWebhook = (req: Request, res: Response) => {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    if (mode && token) {
        
        const isValid = checkVerifyToken(mode, token);

        if (isValid) {
            console.log(':white_check_mark: Webhook verified successfully!');
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
};


// POST (receive webhook events from Meta)
export const receiveWebhookEvent = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const authResult = await processWebhookEvent(body);

        if (authResult && authResult.isAuthorized === false && authResult.phoneNumber) {
            return await handleUnauthorizedAccess(res, authResult.phoneNumber);
        }

        return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
        console.error("Error processing webhook event:", error);
        return res.status(200).send('EVENT_RECEIVED'); 
    }
};