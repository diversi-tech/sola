import { Request, Response, NextFunction } from 'express'; 
import { processGoogleCallback } from '../services/calendar.service.js';
import { HttpStatusCode} from '../types/authErrors.enum.js';

export const googleCallbackHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const code = req.query.code as string;
        const state = req.query.state as string;
        const error = req.query.error as string;

        if (!code && !error) {
            res.status(400).json({ message: "Invalid request - missing data from Google." });
            return;
        }

        await processGoogleCallback(code, state, error);

        res.status(HttpStatusCode.OK).json({
            IsSucceeded: true,
            statusCode: HttpStatusCode.OK,
            message: "Google Calendar authentication successful! You can close this window."
        });

    } catch (err: any) {
        next(err);
    }
};