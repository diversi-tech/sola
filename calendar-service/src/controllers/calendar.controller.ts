import { Request, Response, NextFunction } from 'express'; 
import { processGoogleCallback } from '../services/calendar.service.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuthErrorType ,HttpStatusCode} from '../types/authErrors.enum.js';

export const googleCallbackHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const code = req.query.code as string;
        const state = req.query.state as string;
        const error = req.query.error as string;

        if (!code && !error) {
            return res.status(400).json({ message: "Invalid request - missing data from Google." });
        }

        await processGoogleCallback(code, state, error);

        res.status(HttpStatusCode.OK).json({
            IsSucceeded: true,
            statusCode: HttpStatusCode.OK,
            message: "Connection to Google Calendar was successful! You can close the window."
        });

    } catch (err: any) {
        next(err);
    }
};