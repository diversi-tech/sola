import { google } from 'googleapis';
import { Meeting } from '../models/meeting.model.js';
import { decryptToken } from '../utils/crypto.util.js';
import { mapEventsToMeetings, getLastWeekDate, getNextMonthDate } from './meeting.mapper.js';
import { validateEmployeeAndToken, saveMeetings, getAllActiveEmployees, getAllMeetings as getAllMeetingsFromDb } from './meeting.repository.js';
import { saveSyncToken } from './webhook.repository.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function syncEmployeeCalendar(
  employee_id: number,
  refreshToken: string
): Promise<void> {
  
  const validation = await validateEmployeeAndToken(employee_id, refreshToken);
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
    console.error(`[Sync] Google API call failed for employee ${employee_id}:`, googleError.message);
    const error: any = new Error(`Google Authentication failed: ${googleError.message}`);
    error.statusCode = googleError.status || 401; 
    throw error; 
  }

  const events = response.data.items ?? [];
  const meetings: Meeting[] = mapEventsToMeetings(events, employee_id);

  if (meetings.length === 0) {
    console.log(`[Sync] employee ${employee_id} has no meetings to sync`);
    return;
  }

  await saveMeetings(meetings);
  console.log(`[Sync] Saved/updated ${meetings.length} meetings`);
}

export async function syncAllActiveEmployees(): Promise<void> {
  const employees = await getAllActiveEmployees();

  if (!employees?.length) {
    console.log('[Sync] no employees found');
    return;
  }

  for (const employee of employees) {
    try {
      await syncEmployeeCalendar(employee.id, employee.refresh_token);
    } catch (err) {
      console.error(`[Sync] failed for ${employee.employee_email}:`, err);
    }
  }
}

async function fetchIncrementalEvents(
  calendar: any,
  syncToken: string
): Promise<{ events: any[]; nextSyncToken?: string }> {
  const response = await calendar.events.list({
    calendarId:   'primary',
    syncToken:    syncToken,
    singleEvents: true,
  });

  return {
    events: response.data.items ?? [],
    nextSyncToken: response.data.nextSyncToken,
  };
}

async function fetchFullRangeEvents(
  calendar: any
): Promise<{ events: any[] }> {
  const timeMin = getLastWeekDate();
  const timeMax = getNextMonthDate();

  const response = await calendar.events.list({
    calendarId:   'primary',
    timeMin:      timeMin.toISOString(),
    timeMax:      timeMax.toISOString(),
    singleEvents: true,
    orderBy:      'startTime',
    maxResults:   250,
    showDeleted:  false,
  });

  return { events: response.data.items ?? [] };
}

async function fetchInitialSyncToken(calendar: any): Promise<string | undefined> {
  let pageToken: string | undefined = undefined;
  let syncToken: string | undefined = undefined;

  do {
    const response: any = await calendar.events.list({
      calendarId:   'primary',
      singleEvents: true,
      maxResults:   250,
      showDeleted:  false,
      pageToken:    pageToken,
    });

    pageToken = response.data.nextPageToken;
    syncToken = response.data.nextSyncToken;

  } while (pageToken);

  return syncToken;
}

export async function syncEmployeeCalendarIncremental(
  employee_id: number,
  encryptedRefreshToken: string,
  syncToken: string | null
): Promise<void> {
  let decryptedToken: string;
  try {
    decryptedToken = decryptToken(encryptedRefreshToken);
  } catch (cryptoError) {
    console.error(`[Webhook Sync] Corrupted token for employee ${employee_id}`);
    return;
  }

  oauth2Client.setCredentials({ refresh_token: decryptedToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  let events: any[] = [];
  let nextSyncToken: string | undefined;

  try {
    if (syncToken) {
      const result = await fetchIncrementalEvents(calendar, syncToken);
      events = result.events;
      nextSyncToken = result.nextSyncToken;
    } else {
      const result = await fetchFullRangeEvents(calendar);
      events = result.events;

      const initialSyncToken = await fetchInitialSyncToken(calendar);
      if (initialSyncToken) {
        await saveSyncToken(employee_id, initialSyncToken);
        console.log(`[Webhook Sync] Saved initial syncToken for employee ${employee_id}`);
      }
    }
  } catch (googleError: any) {
    if (googleError.code === 410) {
      console.warn(`[Webhook Sync] syncToken expired for employee ${employee_id}, falling back to full sync`);
      await saveSyncToken(employee_id, '');
      return syncEmployeeCalendarIncremental(employee_id, encryptedRefreshToken, null);
    }

    console.error(`[Webhook Sync] Google API failed for employee ${employee_id}:`, googleError.message);
    return;
  }

  const meetings: Meeting[] = mapEventsToMeetings(events, employee_id);

  if (meetings.length > 0) {
    await saveMeetings(meetings);
    console.log(`[Webhook Sync] Saved/updated ${meetings.length} meetings for employee ${employee_id}`);
  } else {
    console.log(`[Webhook Sync] No meeting changes for employee ${employee_id}`);
  }

  if (nextSyncToken) {
    await saveSyncToken(employee_id, nextSyncToken);
  }
}
export async function getAllMeetings(): Promise<Meeting[]> {
  return await getAllMeetingsFromDb();
}
