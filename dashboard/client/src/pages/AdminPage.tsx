import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../features/admin/hooks/useAdminData';
import { PermissionsTable } from '../features/admin/components/PermissionsTable';
import { AddEmployeeModal } from '../features/admin/components/AddEmployeeModal';
import { CategoryManager } from '../features/categories/components/CategoryManager';
import logo from '../assets/sola-logo.png';

type AdminTab = 'employees' | 'permissions' | 'categories';

const TABS: { key: AdminTab; label: string }[] = [
  { key: 'employees', label: 'עובדים' },
  { key: 'permissions', label: 'הרשאות' },
  { key: 'categories', label: 'מדדים' },
];

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { employees, permissions, loading, error, addEmployee, togglePermission } = useAdminData();

  const [activeTab, setActiveTab] = useState<AdminTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [employees, searchQuery]);

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
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">HR Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              חזרה לניהול עובדים
            </button>
            <img src={logo} alt="Sola" className="h-7 object-contain" onError={handleImageError} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">ניהול</h1>
          <p className="text-slate-500 text-sm">ניהול עובדים, הרשאות ומדדים למעקב במערכת Sola</p>
        </div>

        <div className="flex gap-1 mb-8 bg-white border border-slate-100 rounded-xl p-1 w-fit shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'employees' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">רשימת דיווחים</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
                  {employees.length} עובדים
                </span>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  הוספת עובד
                </button>
              </div>
            </div>

            {employees.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {employees.map((employee) => (
                  <div key={employee.id} className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{employee.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{employee.permissions.length} הרשאות</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 font-medium">אין עדיין עובדים במערכת.</div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="font-bold text-slate-800">ניהול הרשאות</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="חיפוש עובד לפי שם..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 bg-white border border-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                  {filteredEmployees.length} עובדים
                </span>
              </div>
            </div>

            {filteredEmployees.length > 0 ? (
              <div className="p-6">
                <PermissionsTable
                  employees={filteredEmployees}
                  permissions={permissions}
                  onTogglePermission={togglePermission}
                />
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 font-medium">
                לא נמצאו עובדים התואמים לחיפוש שלך.
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && <CategoryManager />}
      </div>

      {isAddModalOpen && (
        <AddEmployeeModal
          permissions={permissions}
          onClose={() => setIsAddModalOpen(false)}
          onCreate={addEmployee}
        />
      )}
    </div>
  );
};

export default AdminPage;
