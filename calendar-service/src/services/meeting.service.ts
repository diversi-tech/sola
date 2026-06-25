import { google } from 'googleapis';
import { Meeting } from '../models/meeting.model.js';
import { decryptToken } from '../utils/crypto.util.js';
import { mapEventsToMeetings, getLastWeekDate, getNextMonthDate } from './meeting.mapper.js';
import { validateUserAndToken, saveMeetings, getAllActiveUsers } from './meeting.repository.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function syncUserCalendar(
  user_id: number,
  refreshToken: string
): Promise<void> {
  
  const validation = await validateUserAndToken(user_id, refreshToken);
  if (!validation.valid) {
    const error: any = new Error(validation.error);
    error.statusCode = validation.error?.includes('does not exist') ? 404 : 401;
    throw error;
  }

  let decryptedToken: string;
  try {
    decryptedToken = decryptToken(refreshToken);
  } catch (cryptoError) {
    const error: any = new Error('Corrupted or invalid token format.');
    error.statusCode = 400;
    throw error;
  }

  oauth2Client.setCredentials({ refresh_token: decryptedToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  let response;
  try {
    const timeMin = getLastWeekDate();
    const timeMax = getNextMonthDate();

    response = await calendar.events.list({
      calendarId:   'primary',
      timeMin:      timeMin.toISOString(),
      timeMax:      timeMax.toISOString(),
      singleEvents: true,
      orderBy:      'startTime',
      maxResults:   250,
    });
  } catch (googleError: any) {
    
    console.error(`[Sync] Google APction failed for user ${user_id}:`, googleError.message);
    const error: any = new Error(`Google Authentication failed: ${googleError.message}`);
    error.statusCode = googleError.status || 401; 
    throw error; 
  }

  const events = response.data.items ?? [];

  const meetings: Meeting[] = mapEventsToMeetings(events, user_id);

  if (meetings.length === 0) {
    console.log(`[Sync] user ${user_id} has no meetings to sync`);
    return;
  }

  await saveMeetings(meetings);
  
  console.log(`[Sync] Saved/updated ${meetings.length} meetings`);
}

export async function syncAllActiveUsers(): Promise<void> {
  const users = await getAllActiveUsers();

  if (!users?.length) {
    console.log('[Sync] no users found');
    return;
  }

  for (const user of users) {
    try {
      await syncUserCalendar(user.id, user.refresh_token);
    } catch (err) {
      console.error(`[Sync] failed for ${user.employee_email}:`, err);
    }
  }
}