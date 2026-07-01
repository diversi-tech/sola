import React, { useMemo, useState } from 'react';
import useEmployeeData from '../features/employees/hooks/useEmployeeData';
import { EmployeeRow } from '../features/employees/components/EmployeeRow';
import { EmployeeModal } from '../features/employees/components/EmployeeModal';
import logo from '../assets/sola-logo.png';
import { Employee } from '../features/employees/api/employeeApi'; // ייבוא הממשק מהמקור הנכון



// --- הגדרת ממשקים ---
interface Stats {
    total: number;
    active: number;
    inactive: number;
}

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

    const CALENDAR_API = import.meta.env.VITE_CALENDAR_SERVICE_URL;
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAuthSubmit = async (email: string) => {
        const response = await fetch(`${CALENDAR_API}/api/calendar/auth/calendar-subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee_email: email }),
        });

        if (!response.ok) {
            throw new Error('שגיאה בשליחת הבקשה');
        }
        setSuccessMessage('המייל נשלח לעובד בהצלחה!');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const stats = useMemo<Stats>(() => {
        // הוספת הגנה: מוודאים ש-employees הוא אכן מערך לפני שעושים עליו filter
        if (!employees || !Array.isArray(employees)) {
            return { total: 0, active: 0, inactive: 0 };
        }
        const active = employees.filter(emp => emp.is_active).length;
        return {
            total: employees.length,
            active: active,
            inactive: employees.length - active
        };
    }, [employees]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        target.style.display = 'none';
        if (target.parentNode) {
            (target.parentNode as HTMLElement).innerHTML =
                '<span class="text-2xl font-black text-slate-800">sola<span class="text-blue-600">.</span></span>';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-5 bg-blue-50/50" style={{ direction: 'rtl' }}>
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 shadow-sm" />
                <p className="text-slate-700 font-semibold text-lg animate-pulse">
                    טוען נתוני מערכת...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-16 bg-red-50 border border-red-200 rounded-3xl text-center shadow-lg" style={{ direction: 'rtl' }}>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 className="text-red-900 text-xl font-bold mb-2">שגיאה בטעינת העמוד</h3>
                <p className="text-red-600 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/50" style={{ direction: 'rtl' }}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-xs font-bold text-blue-700 tracking-wide">
                                פורטל HR ראשי
                            </span>
                        </div>

                        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                            מערכת ניהול עובדים
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            צפייה וניהול של תיקי עובדים, מדדי ביצוע ודוחות מערכת.
                        </p>
                    </div>

                    <div className="shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-20 w-auto">
                        <img
                            src={logo}
                            alt="Sola Logo"
                            className="h-full object-contain"
                            onError={handleImageError}
                        />
                    </div>
                </div>
                <div className="mb-8 h-1 w-full bg-gradient-to-l from-blue-600 via-sky-400 to-transparent rounded-full opacity-80" />

                <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-xl border border-blue-100/50 shadow-xl shadow-blue-900/5 relative">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 rounded-full bg-blue-600" />
                            <h2 className="text-lg font-bold text-slate-800">
                                אינדקס עובדים
                            </h2>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            לחץ על שורת עובד לפירוט מלא
                        </span>
                    </div>

                    <div className="space-y-1">
                        {Array.isArray(employees) && employees.length > 0 ? (
                            employees.map((employee: Employee) => {
                                const numericId = typeof employee.id === 'string' ? parseInt(employee.id, 10) : employee.id;
                                const currentRating = (numericId % 3) + 3;

                                return (
                                    <EmployeeRow
                                        key={employee.id}
                                        employee={employee}
                                        rating={currentRating}
                                        onClick={() => handleSelectEmployee({ ...employee, id: numericId } as Employee)}
                                        onAuthClick={() => handleAuthSubmit(employee.Email)}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-slate-500 font-medium">
                                לא נמצאו עובדים במערכת.
                            </div>
                        )}
                    </div>
                </div>

                {selectedEmployee && (
                    <EmployeeModal
                        employee={selectedEmployee}
                        reports={currentReports}
                        loading={modalLoading}
                        onClose={handleCloseModal}
                    />
                )}
                {successMessage && (
                    <div className="fixed bottom-6 left-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}