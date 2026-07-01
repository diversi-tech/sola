import React, { useState } from 'react';
import { EmployeeMetrics } from './EmployeeMetrics';
import { EmployeeReports } from './EmployeeReports';
import { calculateEmployeeRating } from '../api/employeeApi';

interface Employee {
  id: string | number;
  name: string;
  is_active: boolean;
}

interface Report {
  id: string | number;
  created_at: string;
  metric_scores: { [key: string]: number };
}

interface EmployeeModalProps {
  employee: Employee;
  reports: Report[];
  loading: boolean;
  onClose: () => void;
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-pink-500 to-rose-400',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, reports, loading, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');

  const gradientIndex = typeof employee.id === 'number'
    ? employee.id % AVATAR_GRADIENTS.length
    : employee.name.charCodeAt(0) % AVATAR_GRADIENTS.length;

  const rating = calculateEmployeeRating(reports as any);

  const latestDate = reports.length > 0
    ? new Date(reports[0].created_at).toLocaleDateString('he-IL', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  const tabs = [
    { key: 'overview' as const, label: 'סקירה ומדדים', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { key: 'reports' as const, label: 'היסטוריית דוחות', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-8"
      style={{ direction: 'rtl' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">

        {/* ── Gradient header ── */}
        <div className={`relative bg-gradient-to-l from-indigo-700 via-indigo-600 to-violet-600 px-8 pt-8 pb-0 overflow-hidden`}>

          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-0 left-1/3 w-24 h-24 rounded-full bg-white/5" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Employee identity */}
          <div className="flex items-end gap-5 relative z-10">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[gradientIndex]} flex items-center justify-center text-white text-2xl font-extrabold shadow-lg border-2 border-white/20 mb-5`}>
              {employee.name.charAt(0).toUpperCase()}
            </div>

            <div className="pb-5 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{employee.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  employee.is_active
                    ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
                    : 'bg-white/10 text-white/50 border-white/20'
                }`}>
                  {employee.is_active ? 'פעיל' : 'לא פעיל'}
                </span>
              </div>

              {/* Key stats inline */}
              <div className="flex items-center gap-4 text-sm text-indigo-200">
                <span>#{employee.id}</span>
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                <span>{reports.length} דוחות</span>
                {latestDate && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    <span>עודכן {latestDate}</span>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-300 fill-amber-300' : 'text-white/20 fill-white/20'}`} viewBox="0 0 24 24">
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
                    </svg>
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 relative z-10">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-indigo-700'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto bg-slate-50/60 p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <p className="text-slate-500 text-sm font-medium">טוען נתונים...</p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {activeTab === 'overview' && <EmployeeMetrics reports={reports} />}
              {activeTab === 'reports'  && <EmployeeReports reports={reports} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
