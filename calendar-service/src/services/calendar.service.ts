import { supabase } from '../config/supabase.js';
import { google } from 'googleapis';
import { encryptToken } from '../utils/crypto.util.js';
import { CalendarServiceError } from '../middleware/error.middleware.js';
import { AuthErrorType } from '../types/authErrors.enum.js'
import { registerWebhookChannel } from './webhook.service.js';

const oauth2Client = new google.auth.OAuth2(
    process.env.CALENDAR_GOOGLE_CLIENT_ID,
    process.env.CALENDAR_GOOGLE_CLIENT_SECRET,
    process.env.CALENDAR_GOOGLE_REDIRECT_URI
);

export const processGoogleCallback = async (code: string, state: string, error?: string) => {
    if (error) {
        if (state) {
            await supabase
                .from('Employee_token')
                .update({ status: 'INACTIVE', state: null })
                .eq('state', state);
        }

        throw new CalendarServiceError(
            'The connection was denied. You cannot access the calendar.',
            AuthErrorType.USER_DENIED
        );
    }

     const { data: authRecord, error: dbError } = await supabase
        .from('Employee_token')
        .select('*')
        .eq('state', state)
        .maybeSingle();

    if (dbError) {
        throw new CalendarServiceError(
            'Database error while validating the request.',
            AuthErrorType.DB_SAVE_ERROR
        );
    }

    if (!authRecord) {
        throw new CalendarServiceError(
            'Security error: The request is invalid or has expired.',
            AuthErrorType.SECURITY_ERROR
        );
    }

    if (authRecord.status === 'ACTIVE') {
        throw new CalendarServiceError(
            'This calendar access has already been approved.',
            AuthErrorType.USER_ALREADY_ACTIVE
        );
    }

    let tokens;
    try {
        const response = await oauth2Client.getToken(code);
        tokens = response.tokens;
    } catch (googleErr: any) {
            console.error('[Google code exchange] failed:', {
            message: googleErr?.message,
            googleError: googleErr?.response?.data,
            redirectUri: process.env.GOOGLE_REDIRECT_URI,
        });
        throw new CalendarServiceError(
            'Error with Google API during code exchange.',
            AuthErrorType.GOOGLE_API_ERROR
        );
    }

    const tokenToSave = tokens.refresh_token || authRecord.refresh_token;
    if (!tokenToSave) {
        throw new CalendarServiceError(
            'No refresh token received from Google.',
            AuthErrorType.NO_REFRESH_TOKEN
        );
    }

    const encryptedToken = encryptToken(tokenToSave);

    const { error: updateError } = await supabase
        .from('Employee_token')
        .update({
            refresh_token: encryptedToken,
            status: 'ACTIVE',
            updated_at: new Date().toISOString(),
        })
        .eq('id', authRecord.id);

    if (updateError) {
        throw new CalendarServiceError(
            'Error saving data to the database.',
            AuthErrorType.DB_SAVE_ERROR
        );
    }

    try {
        await registerWebhookChannel(authRecord.id, encryptedToken);
    } catch (webhookErr: any) {
        console.error(`[Webhook] Failed to register channel for user ${authRecord.id}:`, webhookErr.message);
    }

    return authRecord;
};