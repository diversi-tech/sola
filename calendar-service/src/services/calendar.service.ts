import { supabase } from '../config/supabase.js';
import { google } from 'googleapis';
import { encryptToken } from '../utils/crypto.util.js';

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
                .update({ status: 'UNACTIVE', state: null }) 
                .eq('state', state);
        }
        throw new Error("USER_DENIED");
    }

    const { data: authRecord, error: dbError } = await supabase
        .from('Users')
        .select('*')
        .eq('state', state)
        .eq('status', 'UNACTIVE')
        .single();

    if (dbError || !authRecord) {
        throw new Error("SECURITY_ERROR");
    }

    let tokens;
    try {
        const response = await oauth2Client.getToken(code);
        tokens = response.tokens;
    } catch (googleErr) {
        throw new Error("GOOGLE_API_ERROR");
    }

    const tokenToSave = tokens.refresh_token || authRecord.refresh_token;
    if (!tokenToSave) {
        throw new Error("NO_REFRESH_TOKEN");
    }

    const encryptedToken = encryptToken(tokenToSave);

    const { error: updateError } = await supabase
        .from('Users')
        .update({
            refresh_token: encryptedToken,
            status: 'ACTIVE',
            state: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', authRecord.id);

    if (updateError) {
        throw new Error("DB_SAVE_ERROR");
    }

    return authRecord; 
};