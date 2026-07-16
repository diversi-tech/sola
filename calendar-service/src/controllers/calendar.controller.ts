import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processGoogleCallback } from '../services/calendar.service.js';
import { CalendarServiceError } from '../middleware/error.middleware.js'; 
import { AuthErrorType } from '../types/authErrors.enum.js'; 
import {
  StatusPageData,
  CalendarAuthSuccessPage,
  CalendarAuthAlreadyActivePage,
  CalendarAuthDeniedPage,
  CalendarAuthExpiredPage,
  CalendarAuthGoogleErrorPage,
  CalendarAuthInvalidRequestPage,
  CalendarAuthGenericErrorPage,
} from '../views/calendarAuthTemplates.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '../views/calendarAuthStatus.html');
const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

function renderStatusPage(res: Response, data: StatusPageData) {
  const html = htmlTemplate
    .replace(/{{TITLE}}/g, data.title)
    .replace(/{{MESSAGE}}/g, data.message)
    .replace(/{{ICON}}/g, data.success ? '✓' : '✕')
    .replace(/{{ICON_CLASS}}/g, data.success ? 'success' : 'error');

  res.status(200).send(html);
}

export const googleCallbackHandler = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const error = req.query.error as string;

    if (!code && !error) {
        return renderStatusPage(res, CalendarAuthInvalidRequestPage());
    }

    try {
        await processGoogleCallback(code, state, error);
        return renderStatusPage(res, CalendarAuthSuccessPage());
    } catch (err: any) {
        if (err instanceof CalendarServiceError) {
            switch (err.statusCode) {
                case AuthErrorType.USER_ALREADY_ACTIVE:
                    return renderStatusPage(res, CalendarAuthAlreadyActivePage());
                case AuthErrorType.USER_DENIED:
                    return renderStatusPage(res, CalendarAuthDeniedPage());
                case AuthErrorType.SECURITY_ERROR:
                    return renderStatusPage(res, CalendarAuthExpiredPage());
                case AuthErrorType.GOOGLE_API_ERROR:
                    return renderStatusPage(res, CalendarAuthGoogleErrorPage());
                default:
                    return renderStatusPage(res, CalendarAuthGenericErrorPage(err.message));
            }
        }

        console.error('[googleCallbackHandler] Unexpected error:', err);
        return renderStatusPage(res, CalendarAuthGenericErrorPage());
    }
};