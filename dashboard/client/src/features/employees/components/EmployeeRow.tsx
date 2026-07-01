import React from 'react';

interface Employee {
  id: string | number;
  name: string;
  is_active: boolean;
}

interface EmployeeRowProps {
  employee: Employee;
  rating: number;
  reportCount: number;
  latestReportDate: string;
  onClick: () => void;
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-pink-500 to-rose-400',
];

export const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee, rating, reportCount, latestReportDate, onClick,
}) => {
  const formattedDate = latestReportDate
    ? new Date(latestReportDate).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  const gradientIndex = typeof employee.id === 'number'
    ? employee.id % AVATAR_GRADIENTS.length
    : employee.name.charCodeAt(0) % AVATAR_GRADIENTS.length;

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 px-6 py-4 hover:bg-indigo-50/40 cursor-pointer transition-colors duration-150"
      style={{ direction: 'rtl' }}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[gradientIndex]} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
        {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors truncate">
            {employee.name}
          </span>
          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            employee.is_active
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {employee.is_active ? 'פעיל' : 'לא פעיל'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>#{employee.id}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span>{reportCount} דוחות</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span>עודכן {formattedDate}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-0.5 shrink-0">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        ))}
      </div>

      {/* Chevron */}
      <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 shrink-0 transition-colors rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};
