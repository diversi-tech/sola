import { supabase } from '../config/supabase.js';
import { google } from 'googleapis';
import { encryptToken } from '../utils/crypto.util.js';
import { CalendarServiceError } from '../middleware/error.middleware.js';
import { AuthErrorType } from '../types/authErrors.enum.js'

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const processGoogleCallback = async (code: string, state: string, error?: string) => {
    if (error) {
        if (state) {
            await supabase
                .from('Users')
                .update({ status: 'INACTIVE', state: null })
                .eq('state', state);
        }

        throw new CalendarServiceError(
            'The connection was denied. You cannot access the calendar.',
            AuthErrorType.USER_DENIED
        );
    }

    const { data: authRecord, error: dbError } = await supabase
        .from('Users')
        .select('*')
        .eq('state', state)
        .eq('status', 'INACTIVE')
        .single();

    if (dbError || !authRecord) {
        throw new CalendarServiceError(
            'Security error: The request is invalid or has expired.',
            AuthErrorType.SECURITY_ERROR
        );
    }

    let tokens;
    try {
        const response = await oauth2Client.getToken(code);
        tokens = response.tokens;
    } catch (googleErr) {
        throw new CalendarServiceError(
            'Error with Google API during code exchange.',
            AuthErrorType.GOOGLE_API_ERROR
        );
    }

    const tokenToSave = tokens.refresh_token || authRecord.refresh_token;
    try {

        const decoded = JSON.parse(
            Buffer.from(tokens.id_token!.split('.')[1], 'base64').toString()
        );

        if (decoded.email !== authRecord.employee_email) {
            throw new CalendarServiceError(
                'Wrong account selected. Please sign in with the correct email.',
                AuthErrorType.SECURITY_ERROR
            );
        }
    } catch (err) {
        if (err instanceof CalendarServiceError) throw err;
        throw new CalendarServiceError(
            'Could not verify account identity.',
            AuthErrorType.GOOGLE_API_ERROR
        );
    }
    if (!tokenToSave) {
        throw new CalendarServiceError(
            'No refresh token received from Google.',
            AuthErrorType.NO_REFRESH_TOKEN
        );
    }

    const encryptedToken = encryptToken(tokenToSave);

    const { error: updateError } = await supabase
        .from('Users')
        .update({
            refresh_token: encryptedToken,
            status: 'ACTIVE',
            state: null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', authRecord.id);

    if (updateError) {
        throw new CalendarServiceError(
            'Error saving data to the database.',
            AuthErrorType.DB_SAVE_ERROR
        );
    }

    return authRecord;
};