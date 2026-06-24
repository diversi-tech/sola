import { google } from 'googleapis';
import { supabase } from '../config/supabase.js';
import { Meeting, MeetingType } from '../models/meeting.model.js';
import { decryptToken } from '../utils/crypto.util.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

function detectVideoCallProvider(event: any): string | null {
  if (event.hangoutLink) return 'Google Meet';
  if (event.conferenceData?.conferenceSolution?.name) {
    return event.conferenceData.conferenceSolution.name;
  }

  const text = `${event.location || ''} ${event.description || ''}`.toLowerCase();
  if (text.includes('meet.google.com')) return 'Google Meet';
  
  return null;
}

function inferMeetingType(event: any, participantsCount: number): MeetingType {
  const isOnline = !!detectVideoCallProvider(event);
  const isPersonal = participantsCount <= 2;

  if (isOnline && isPersonal) return MeetingType.ONLINE_PERSONAL_MEETING;
  if (isOnline) return MeetingType.ONLINE_TEAM_MEETING;
  if (isPersonal) return MeetingType.FRONTAL_PERSONAL_MEETING;
  return MeetingType.FRONTAL_TEAM_MEETING;
}

function mapEventToMeeting(event: any, badgeNumber: number): Meeting | null {
  if (!event.start?.dateTime || !event.end?.dateTime) return null;

  const startTime = event.start.dateTime;
  const endTime = event.end.dateTime;

  const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const estimatedMinutes = Math.floor(diffMs / 60000);
  const participantsCount = (event.attendees ?? []).length;

  return {
    google_event_id:            event.id,
    title:                      event.summary ?? 'Untitled Meeting',
    type:                       inferMeetingType(event, participantsCount),
    created_at:                 event.created ?? new Date().toISOString(),
    created_to:                 startTime,
    estimated_duration_minutes: estimatedMinutes,
    participants_count:         participantsCount,
    manager_id:                 undefined,
    calendar_id:                badgeNumber,
    start_time:                 startTime,
    end_time:                   endTime,
    actual_time:                null,
    efficiency_score:           undefined,
    attendees:                  (event.attendees ?? []).map((att: any) => att.email),
  };
}

export async function syncUserCalendar(
  badgeNumber: number,
  refreshToken: string
): Promise<void> {
  
  const { data: user, error: userError } = await supabase
    .from('Users')
    .select('id, refresh_token')
    .eq('id', badgeNumber)
    .single();

  if (userError || !user) {
   
    const error: any = new Error(`User with ID ${badgeNumber} does not exist in the system.`);
    error.statusCode = 404;
    throw error;
  }
  if (user.refresh_token !== refreshToken) {
     const error: any = new Error(`Provided refresh token does not match the system record for this user.`);
     error.statusCode = 401; // Unauthorized
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
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7); 
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    response = await calendar.events.list({
      calendarId:   'primary',
      timeMin:      lastWeek.toISOString(),
      timeMax:      nextMonth.toISOString(),
      singleEvents: true,
      orderBy:      'startTime',
      maxResults:   250,
    });
  } catch (googleError: any) {
    
    console.error(`[Sync] Google API connection failed for user ${badgeNumber}:`, googleError.message);
    const error: any = new Error(`Google Authentication failed: ${googleError.message}`);
    error.statusCode = googleError.status || 401; 
    throw error; 
  }

  const events = response.data.items ?? [];

  const meetings: Meeting[] = events
    .map((e) => mapEventToMeeting(e, badgeNumber))
    .filter((m): m is Meeting => m !== null);

  if (meetings.length === 0) {
    console.log(`[Sync] user ${badgeNumber} has no meetings to sync`);
    return;
  }

  const { error: dbError } = await supabase
    .from('Meeting')
    .upsert(meetings, { onConflict: 'google_event_id' });

  if (dbError) {
    console.error('[Sync] Supabase error:', dbError.message);
    throw new Error(dbError.message);
  }
  
  console.log(`[Sync] ✅ Saved/updated ${meetings.length} meetings`);
}

export async function syncAllActiveUsers(): Promise<void> {
  const { data: users, error } = await supabase
    .from('Users')
    .select('id, employee_email, refresh_token')
    .not('refresh_token', 'is', null);

  if (error) {
    console.error('[Sync] error fetching users:', error);
    throw error;
  }

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