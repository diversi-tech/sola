//meeting.service.ts
import { google } from 'googleapis';
import { supabase } from '../config/supabase.js';
import { Meeting, MeetingType } from '../models/meeting.model.js';

//חיבור לגוגל
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// זיהוי ספק וידאו קול
function detectVideoCallProvider(event: any): string | null {
  // שלב 1 - שדות מובנים, אמינים ביותר (תמיד נכון ל-Google Meet)
  if (event.hangoutLink) return 'Google Meet';
  if (event.conferenceData?.conferenceSolution?.name) {
    return event.conferenceData.conferenceSolution.name;
  }

  // שלב 2 - גיבוי: חיפוש טקסט חופשי בתיאור/מיקום
  const text = `${event.location || ''} ${event.description || ''}`.toLowerCase();
  if (text.includes('zoom.us')) return 'Zoom';
  if (text.includes('meet.google.com')) return 'Google Meet';
  if (text.includes('teams.microsoft.com')) return 'Microsoft Teams';

  return null; // כנראה פרונטלי, או שאין קישור מזוהה
}

// סוג הפגישה לפי ספק וידאו ומספר משתתפים
function inferMeetingType(event: any, participantsCount: number): MeetingType {
  const isOnline = !!detectVideoCallProvider(event);
  const isPersonal = participantsCount <= 2;

  if (isOnline && isPersonal) return 'Online personal meeting';
  if (isOnline) return 'Online team meeting';
  if (isPersonal) return 'Frontal personal meeting';
  return 'Frontal team meeting';
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
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() - 7);
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 30);

  const response = await calendar.events.list({
    calendarId:   'primary',
    timeMin:      timeMin.toISOString(),
    timeMax:      timeMax.toISOString(),
    singleEvents: true,
    orderBy:      'startTime',
    maxResults:   250,
  });

  const events = response.data.items ?? [];

  const meetings: Meeting[] = events
    .map((e) => mapEventToMeeting(e, badgeNumber))
    .filter((m): m is Meeting => m !== null);

  if (meetings.length === 0) {
    console.log('[Sync] אין פגישות להכנסה');
    return;
  }

  const { error } = await supabase
    .from('Meeting')
    .upsert(meetings, { onConflict: 'google_event_id' });

  if (error) {
    console.error('[Sync] שגיאת Supabase:', error.message);
    throw new Error(error.message);
  }

  console.log(`[Sync] ✅ נשמרו/עודכנו ${meetings.length} פגישות`);
}

export async function syncAllActiveUsers(): Promise<void> {
  const { data: users, error } = await supabase
    .from('Users')
    .select('id, employee_email, refresh_token')
    .not('refresh_token', 'is', null);

  if (error) {
    console.error('[Sync] שגיאה בשליפת משתמשים:', error);
    throw error;
  }

  if (!users?.length) {
    console.log('[Sync] לא נמצאו משתמשים');
    return;
  }

  for (const user of users) {
    try {
      await syncUserCalendar(user.id, user.refresh_token);
    } catch (err) {
      console.error(`[Sync] נכשל עבור ${user.employee_email}:`, err);
    }
  }
}