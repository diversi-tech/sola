import { Request, Response } from 'express';
import { checkVerifyToken, processWebhookEvent } from '../services/webhook.services';

// GET (verify webhook with Meta)
export const verifymetaWebhook = (req: Request, res: Response) => {
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
export const receiveWebhookEvent = (req: Request, res: Response) => {
    const body = req.body;

    processWebhookEvent(body);

    
    res.status(200).send('EVENT_RECEIVED');
};
