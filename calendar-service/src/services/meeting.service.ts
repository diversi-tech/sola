import { google } from 'googleapis';
import { supabase } from '../config/supabase.js';
import { Meeting, MeetingType } from '../models/meeting.model.js';

//חיבור לגוגל
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
//חישוב משך הפגישה
function calcDuration(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:00`;
}

function inferMeetingType(title: string): MeetingType {
  const lower = title.toLowerCase();
  const isOnline = lower.includes('zoom') || lower.includes('meet') || 
                   lower.includes('teams') || lower.includes('online');
  const isPersonal = lower.includes('1:1') || lower.includes('personal') || 
                     lower.includes('one on one');

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

  return {
    title:                      event.summary ?? 'Untitled Meeting',
    type:                       inferMeetingType(event.summary ?? ''),
    CreatedAt:                  event.created ?? new Date().toISOString(),
    CreatedTo:                  startTime,
    Estimated_duration_minutes: estimatedMinutes,
    ParticipantsCount:          (event.attendees ?? []).length,
    ManagerID:                  undefined,
    CalendarID:                 badgeNumber,
    StartTime:                  startTime,
    EndTime:                    endTime,
    Actual_time:                "-",
    EfficiencyScore:            undefined,
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
    .insert(meetings);

  if (error) {
    console.error('[Sync] שגיאת Supabase:', error.message);
    throw new Error(error.message);
  }

  console.log(`[Sync] ✅ נשמרו ${meetings.length} פגישות`);
}

export async function syncAllActiveUsers(): Promise<void> {
  const { data: users, error } = await supabase
    .from('Users')
    .select('id, name, badgenumber, refresh_token')
    .not('refresh_token', 'is', null);

  if (error) throw error;

  if (!users?.length) {
    console.log('[Sync] לא נמצאו משתמשים');
    return;
  }

  for (const user of users) {
    try {
      await syncUserCalendar(user.badgenumber, user.refresh_token);
    } catch (err) {
      console.error(`[Sync] נכשל עבור ${user.name}:`, err);
    }
  }
}