import React, { useMemo, useState } from 'react';
import useEmployeeData from '../features/employees/hooks/useEmployeeData';
import { EmployeeRow } from '../features/employees/components/EmployeeRow';
import { EmployeeModal } from '../features/employees/components/EmployeeModal';
import logo from '../assets/sola-logo.png';
import { calculateEmployeeRating } from '../features/employees/api/employeeApi';

export default function EmployeePage() {
  const {
    employeesWithReports,
    selectedEmployee,
    currentReports,
    currentMeetings,
    loading,
    meetingsLoading,
    error,
    initialTab,
    handleSelectEmployee,
    handleViewMeetings,
    handleCloseModal,
  } = useEmployeeData();

  // סטייט חדש לשמירת מילת החיפוש
  const [searchQuery, setSearchQuery] = useState('');

  // סינון העובדים לפי שורת החיפוש
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employeesWithReports;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return employeesWithReports.filter((item) =>
      item.employee.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [employeesWithReports, searchQuery]);

  // עדכון הסטטיסטיקות כך שישקפו את הרשימה המסוננת
  const stats = useMemo(() => {
    const active = filteredEmployees.filter(e => e.employee.is_active).length;
    return { 
      total: filteredEmployees.length, 
      active, 
      inactive: filteredEmployees.length - active 
    };
  }, [filteredEmployees]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    if (target.parentNode) {
      (target.parentNode as HTMLElement).innerHTML =
        '<span class="text-xl font-black text-slate-800">sola<span style="color:#4f46e5">.</span></span>';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 bg-slate-50" style={{ direction: 'rtl' }}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100" />
          <div className="w-16 h-16 rounded-full border-4 border-t-indigo-600 animate-spin absolute inset-0" />
        </div>
        <p className="text-slate-600 font-semibold">טוען נתוני מערכת...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50" style={{ direction: 'rtl' }}>
        <div className="max-w-md w-full mx-4 bg-white border border-red-100 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-slate-900 text-lg font-bold mb-1">שגיאה בטעינת הנתונים</h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ direction: 'rtl' }}>

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">HR Dashboard</span>
          </div>
          <img src={logo} alt="Sola" className="h-7 object-contain" onError={handleImageError} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">ניהול עובדים</h1>
          <p className="text-slate-500 text-sm">ממוין לפי תאריך הדוח האחרון</p>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="חיפוש עובד לפי שם..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-sm rounded-xl pl-4 pr-11 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Employee list ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">רשימת עובדים</h2>
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
              {stats.total} עובדים
            </span>
          </div>

          {filteredEmployees.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filteredEmployees.map((item) => (
                <EmployeeRow
                  key={item.employee.id}
                  employee={item.employee}
                  rating={calculateEmployeeRating(item.reports)}
                  reportCount={item.reports.length}
                  latestReportDate={item.latest_report_date}
                  onClick={() => handleSelectEmployee(item)}
                  onViewMeetings={() => handleViewMeetings(item.employee)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 font-medium">
              {searchQuery.trim() 
                ? 'לא נמצאו עובדים התואמים לחיפוש שלך.' 
                : 'לא נמצאו עובדים עם דוחות במערכת.'}
            </div>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          reports={currentReports}
          meetings={currentMeetings}
          loading={false}
          meetingsLoading={meetingsLoading}
          initialTab={initialTab}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}