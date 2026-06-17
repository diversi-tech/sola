// src/components/employee/EmployeePage.jsx
import React from 'react';
import useEmployeeData from '../features/employees/hooks/useEmployeeData';
import { EmployeeRow } from '../features/employees/components/EmployeeRow';
import { EmployeeModal } from '../features/employees/components/EmployeeModal';

export default function EmployeePage() {
  const {
    employees,
    selectedEmployee,
    currentReports,
    loading,
    modalLoading,
    error,
    handleSelectEmployee,
    handleCloseModal
  } = useEmployeeData();

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center h-screen gap-4"
        style={{ direction: 'rtl', background: '#EFF6FF' }}
      >
        <div
          className="rounded-full h-12 w-12 animate-spin"
          style={{ border: '3px solid #BFDBFE', borderTopColor: '#2563EB' }}
        />
        <p style={{ color: '#1E3A5F', fontWeight: 600, fontSize: '1rem' }}>
          טוען את נתוני המערכת...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6 max-w-2xl mx-auto mt-10 rounded-2xl text-center"
        style={{
          direction: 'rtl',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
        }}
      >
        <h3 style={{ color: '#991B1B', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
          ארעה שגיאה בטעינת העמוד
        </h3>
        <p style={{ color: '#DC2626', fontSize: '0.875rem' }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ direction: 'rtl', background: 'linear-gradient(160deg, #EFF6FF 0%, #F8FAFF 60%, #EFF6FF 100%)' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* כותרת הדף */}
        <div className="mb-10 text-right">

          {/* תג עליון */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
            style={{ background: '#DBEAFE', border: '1px solid #BFDBFE' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#2563EB' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1D4ED8', letterSpacing: '0.05em' }}>
              מערכת ניהול עובדים
            </span>
          </div>

         
          {/* קו הפרדה כחול */}
          <div className="mt-5" style={{ height: '2px', background: 'linear-gradient(to left, transparent, #2563EB 40%, #0EA5E9)', borderRadius: 2 }} />
        </div>

        {/* כרטיס מיכל לרשימה */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1px solid #BFDBFE',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
          }}
        >
          {/* כותרת הכרטיס */}
          <div className="flex items-center justify-between mb-4 px-1" style={{ direction: 'rtl' }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ background: '#2563EB' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E3A5F' }}>
                {employees.length} עובדים
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>לחץ על עובד לפרטים</span>
          </div>

          {/* שורות העובדים */}
          <div className="space-y-2">
            {employees.map((employee) => {
              const currentRating = (employee.id % 3) + 3;
              return (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  rating={currentRating}
                  onClick={() => handleSelectEmployee(employee)}
                />
              );
            })}
          </div>
        </div>

        {/* מודל פרטי עובד */}
        {selectedEmployee && (
          <EmployeeModal
            employee={selectedEmployee}
            reports={currentReports}
            loading={modalLoading}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}