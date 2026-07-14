import { google } from 'googleapis';
import { supabase } from '../config/supabase.js';
import { CalendarServiceError } from '../middleware/error.middleware.js';
import { AuthErrorType } from '../types/authErrors.enum.js';
import { getAuthStatusesByEmails, revokeAuthByEmail } from './meeting.repository.js';


const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const getOAuth2Client = () => {
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables');
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

async function upsertAuthSession(employeeEmail: string, state: string): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from('Users')
    .select('id, status')
    .eq('employee_email', employeeEmail)
    .maybeSingle();

  if (fetchError) {
    console.error('Supabase fetch error inside service:', fetchError);
    throw new CalendarServiceError(
      'Database fetch failed',
      AuthErrorType.DB_SAVE_ERROR
    );
  }

  if (existing?.status === 'ACTIVE') {
    throw new CalendarServiceError(
      'העובד כבר אישר גישה ופעיל במערכת',
      AuthErrorType.USER_ALREADY_ACTIVE
    );
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('Users')
      .update({ state, status: 'INACTIVE' })
      .eq('employee_email', employeeEmail);

    if (updateError) {
      console.error('Supabase update error inside service:', updateError);
      throw new CalendarServiceError(
        'Database update failed',
        AuthErrorType.DB_SAVE_ERROR
      );
    }
    return;
  }

  const { error: insertError } = await supabase
    .from('Users')
    .insert([
      {
        employee_email: employeeEmail,
        state,
        status: 'INACTIVE',
      },
    ]);

  if (insertError) {
    console.error('Supabase insertion error inside service:', insertError);
    throw new CalendarServiceError(
      'Database insertion failed',
      AuthErrorType.DB_SAVE_ERROR
    );
  }
}

export const generateGoogleAuthUrl = async (
  employeeEmail: string,
  state: string
): Promise<string> => {
  await upsertAuthSession(employeeEmail, state);

  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    state: state,
  });
};
export const getAuthStatuses = async (
  emails: string[]
): Promise<Record<string, 'ACTIVE' | 'INACTIVE'>> => {
  return getAuthStatusesByEmails(emails);
};

export const revokeCalendarAccess = async (employeeEmail: string): Promise<void> => {
  const { data: existing, error: fetchError } = await supabase
    .from('Users')
    .select('status')
    .eq('employee_email', employeeEmail)
    .maybeSingle();

  if (fetchError) {
    throw new CalendarServiceError(
      'Database fetch failed',
      AuthErrorType.DB_SAVE_ERROR
    );
  }

  if (!existing || existing.status !== 'ACTIVE') {
    throw new CalendarServiceError(
      'Cannot revoke access - employee is currently inactive',
      AuthErrorType.USER_NOT_ACTIVE
    );
  }

  await revokeAuthByEmail(employeeEmail);
};