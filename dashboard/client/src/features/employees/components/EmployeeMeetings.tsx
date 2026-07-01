import React from 'react';
import { Meeting } from '../api/employeeApi';

interface EmployeeMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const EmployeeMeetings: React.FC<EmployeeMeetingsProps> = ({ meetings, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
        <p className="text-gray-500 text-sm font-bold">טוען פגישות...</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-semibold text-sm">לא נמצאו פגישות לעובד זה</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div
          key={meeting.meeting_id}
          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2"
        >
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-bold text-gray-800 text-sm leading-snug">
              {meeting.title ?? 'ללא כותרת'}
            </h4>
            {meeting.type && (
              <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                {meeting.type}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
            <span>
              <span className="font-semibold text-gray-600">התחלה: </span>
              {formatDateTime(meeting.start_time)}
            </span>
            <span>
              <span className="font-semibold text-gray-600">סיום: </span>
              {formatDateTime(meeting.end_time)}
            </span>
            {meeting.estimated_duration_minutes != null && (
              <span>
                <span className="font-semibold text-gray-600">משך משוער: </span>
                {meeting.estimated_duration_minutes} דקות
              </span>
            )}
            {meeting.participants_count != null && (
              <span>
                <span className="font-semibold text-gray-600">משתתפים: </span>
                {meeting.participants_count}
              </span>
            )}
          </div>

          {meeting.attendees && meeting.attendees.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {meeting.attendees.map((attendee, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600"
                >
                  {attendee}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
