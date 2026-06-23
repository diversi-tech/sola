import { google } from 'googleapis';
import { supabase } from '../config/supabase.js';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const getOAuth2Client = () => {
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables');
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

export const initializeAuthSession = async (employeeEmail: string, state: string): Promise<string> => {
  const { error } = await supabase
    .from('Users')
    .insert([
      {
        employee_email: employeeEmail,
        state: state
      }
    ]);

  if (error) {
    console.error('Supabase insertion error inside service:', error);
    throw new Error('Database insertion failed');
  }
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    state: state,
  });
};