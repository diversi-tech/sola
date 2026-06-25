import { Meeting, MeetingType } from '../models/meeting.model.js';

function detectVideoCallProvider(event: any): string | null {
  if (event.hangoutLink) return 'Google Meet';
  if (event.conferenceData?.conferenceSolution?.name) {
    return event.conferenceData.conferenceSolution.name;
  }

  const text = `${event.location || ''} ${event.description || ''}`.toLowerCase();
  if (text.includes('meet.google.com')) return 'Google Meet';
  
  return null;
}

function getParticipantsCount(event: any): number {
  return (event.attendees ?? []).length;
}

function calculateDuration(event: any): number {
  if (!event.start?.dateTime || !event.end?.dateTime) {
    return 0;
  }

  const diffMs = new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime();
  return Math.floor(diffMs / 60000);
}

function inferMeetingType(event: any, participantsCount: number): MeetingType {
  const isOnline = !!detectVideoCallProvider(event);
  const isPersonal = participantsCount <= 2;

  if (isOnline && isPersonal) return MeetingType.ONLINE_PERSONAL_MEETING;
  if (isOnline) return MeetingType.ONLINE_TEAM_MEETING;
  if (isPersonal) return MeetingType.FRONTAL_PERSONAL_MEETING;
  return MeetingType.FRONTAL_TEAM_MEETING;
}

function extractAttendees(event: any): string[] {
  return (event.attendees ?? []).map((att: any) => att.email);
}

export function mapEventToMeeting(event: any, user_id: number): Meeting | null {
  if (!event.start?.dateTime || !event.end?.dateTime) return null;

  const participantsCount = getParticipantsCount(event);
  const estimatedMinutes = calculateDuration(event);

  return {
    google_event_id:            event.id,
    title:                      event.summary ?? 'Untitled Meeting',
    type:                       inferMeetingType(event, participantsCount),
    created_at:                 event.created ?? new Date().toISOString(),
    created_to:                 event.start.dateTime,
    estimated_duration_minutes: estimatedMinutes,
    participants_count:         participantsCount,
    manager_id:                 undefined,
    calendar_id:                user_id,
    start_time:                 event.start.dateTime,
    end_time:                   event.end.dateTime,
    actual_time:                null,
    efficiency_score:           undefined,
    attendees:                  extractAttendees(event),
  };
}

export function mapEventsToMeetings(events: any[], user_id: number): Meeting[] {
  return events
    .map((event) => mapEventToMeeting(event, user_id))
    .filter((meeting): meeting is Meeting => meeting !== null);
}

export function getLastWeekDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}

export function getNextMonthDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}
