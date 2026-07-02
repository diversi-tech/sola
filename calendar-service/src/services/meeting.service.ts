import { google } from 'googleapis';
import { Meeting } from '../models/meeting.model.js';
import { decryptToken } from '../utils/crypto.util.js';
import { mapEventsToMeetings, getLastWeekDate, getNextMonthDate } from './meeting.mapper.js';
import { validateUserAndToken, saveMeetings, getAllActiveUsers } from './meeting.repository.js';
import { saveSyncToken } from './webhook.repository.js';

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
export async function syncUserCalendarIncremental(
  user_id: number,
  encryptedRefreshToken: string,
  syncToken: string | null
): Promise<void> {
  let decryptedToken: string;
  try {
    decryptedToken = decryptToken(encryptedRefreshToken);
  } catch (cryptoError) {
    console.error(`[Webhook Sync] Corrupted token for user ${user_id}`);
    return;
  }

  oauth2Client.setCredentials({ refresh_token: decryptedToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  let response;
  try {
    if (syncToken) {
      response = await calendar.events.list({
        calendarId:   'primary',
        syncToken:    syncToken,
        singleEvents: true,
      });
    } 
    else {
  const timeMin = getLastWeekDate();
  const timeMax = getNextMonthDate();

  // קריאה 1: משיכת פגישות בטווח תאריכים
  response = await calendar.events.list({
    calendarId:   'primary',
    timeMin:      timeMin.toISOString(),
    timeMax:      timeMax.toISOString(),
    singleEvents: true,
    orderBy:      'startTime',
    maxResults:   250,
    showDeleted:  false,
  });
let tokenPageToken: string | undefined = undefined;
let initialSyncToken: string | undefined = undefined;

do {
  const tokenResponse: any = await calendar.events.list({
    calendarId:   'primary',
    singleEvents: true,
    maxResults:   250,
    showDeleted:  false,
    pageToken:    tokenPageToken,
  });

  tokenPageToken = tokenResponse.data.nextPageToken;
  initialSyncToken = tokenResponse.data.nextSyncToken;

  console.log(`[Sync] Token page: nextPageToken=${tokenPageToken}, nextSyncToken=${initialSyncToken}`);

} while (tokenPageToken);

console.log(`[Sync] Got initial syncToken: ${initialSyncToken}`);

if (initialSyncToken) {
  await saveSyncToken(user_id, initialSyncToken);
  console.log(`[Webhook Sync] Saved initial syncToken for user ${user_id}`);
}
}
  } catch (googleError: any) {
    if (googleError.code === 410) {
      console.warn(`[Webhook Sync] syncToken expired for user ${user_id}, falling back to full sync`);
      await saveSyncToken(user_id, '');
      return syncUserCalendarIncremental(user_id, encryptedRefreshToken, null);
    }

    console.error(`[Webhook Sync] Google API failed for user ${user_id}:`, googleError.message);
    return;
  }

  const events = response.data.items ?? [];
  const meetings: Meeting[] = mapEventsToMeetings(events, user_id);

  if (meetings.length > 0) {
    await saveMeetings(meetings);
    console.log(`[Webhook Sync] Saved/updated ${meetings.length} meetings for user ${user_id}`);
  } else {
    console.log(`[Webhook Sync] No meeting changes for user ${user_id}`);
  }
if (response.data.nextSyncToken) {
    await saveSyncToken(user_id, response.data.nextSyncToken);
  }
}