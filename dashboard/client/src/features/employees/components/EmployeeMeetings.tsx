import React, { useState, useMemo, ChangeEvent } from 'react';
import { Meeting } from '../types/employee.types';

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
  const [filterMonth, setFilterMonth] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTitle, setFilterTitle] = useState('');
  const availableTypes = useMemo(() => {
    const types = new Set(meetings.map((m) => m.type).filter((t): t is string => !!t));
    return Array.from(types);
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        if (filterMonth && m.start_time) {
          const meetingMonth = m.start_time.slice(0, 7);
          if (meetingMonth !== filterMonth) return false;
        }
        if (filterType !== 'all' && m.type !== filterType) return false;
        if (filterTitle.trim() && !(m.title ?? '').toLowerCase().includes(filterTitle.trim().toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ta = a.start_time ? new Date(a.start_time).getTime() : 0;
        const tb = b.start_time ? new Date(b.start_time).getTime() : 0;
        return tb - ta;
      });
  }, [meetings, filterMonth, filterType, filterTitle]);
  const totalMinutes = useMemo(() => {
    return filteredMeetings.reduce((sum, m) => sum + (m.estimated_duration_minutes ?? 0), 0);
  }, [filteredMeetings]);

  const formattedTotalTime = useMemo(() => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} דקות`;
    if (minutes === 0) return `${hours} שעות`;
    return `${hours} שעות ו-${minutes} דקות`;
  }, [totalMinutes]);
  const monthLabel = useMemo(() => {
    if (!filterMonth) return null;
    const [year, month] = filterMonth.split('-');
    const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  }, [filterMonth]);

  const summaryParts = useMemo(() => {
    const parts: JSX.Element[] = [];
    if (filterType !== 'all') {
      parts.push(
        <span key="type"> מסוג "<span dir="ltr" className="inline-block">{filterType}</span>"</span>
      );
    }
    if (filterTitle.trim()) {
      parts.push(
        <span key="title"> בנושא "<span dir="ltr" className="inline-block">{filterTitle.trim()}</span>"</span>
      );
    }
    if (monthLabel) {
      parts.push(<span key="month"> בחודש {monthLabel}</span>);
    }
    return parts;
  }, [filterType, filterTitle, monthLabel]);

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
    <div className="animate-fade-in mt-6 pb-6 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">סינון פגישות:</div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={filterTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterTitle(e.target.value)}
            placeholder="חיפוש לפי נושא..."
            className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
          />
          <input
            type="month"
            value={filterMonth}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={filterType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">כל הסוגים</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {(filterMonth || filterType !== 'all' || filterTitle) && (
            <button
              onClick={() => {
                setFilterMonth(''); setFilterType('all'); setFilterTitle('');
              }}
              className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2.5 rounded-xl"
            >
              איפוס
            </button>
          )}
        </div>
      </div>

      <p className="text-indigo-600 text-sm font-semibold mt-3 mb-2">
        ⏱️ סך הכל זמן שהושקע בפגישות{summaryParts}: {formattedTotalTime}
      </p>

      {filteredMeetings.length > 0 ? (
        <div className="relative border-r-2 border-indigo-100 pr-6 mr-8 space-y-8">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.meeting_id}
              className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 group"
            >
              <div className="absolute -right-[35px] top-6 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-slate-50 group-hover:bg-indigo-600"></div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4 gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                    {meeting.title ?? 'ללא כותרת'}
                  </div>
                  {meeting.type && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      {meeting.type}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-500">
                  📅 {formatDateTime(meeting.start_time)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 mb-3">
                <span><span className="font-semibold text-slate-600">התחלה: </span>{formatDateTime(meeting.start_time)}</span>
                <span><span className="font-semibold text-slate-600">סיום: </span>{formatDateTime(meeting.end_time)}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {meeting.estimated_duration_minutes != null && (
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    משך משוער: <span className="text-indigo-600">{meeting.estimated_duration_minutes} דק'</span>
                  </span>
                )}
                {meeting.participants_count != null && (
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    משתתפים: <span className="text-indigo-600">{meeting.participants_count}</span>
                  </span>
                )}
              </div>

              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
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
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
          <p className="text-slate-600 font-bold text-lg">לא נמצאו פגישות התואמות לסינון.</p>
        </div>
      )}
    </div>
  );
};