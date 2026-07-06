import React from 'react';
import { useAdminData } from '../features/admin/hooks/useAdminData';
import { PermissionsTable } from '../features/admin/components/PermissionsTable';

const AdminPage: React.FC = () => {
  // שאיבת כל הנתונים והפונקציות מההוק החכם שיצרנו
  const { employees, permissions, loading, error, togglePermission } = useAdminData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <span className="text-xl text-slate-500 animate-pulse">טוען נתוני מערכת...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">ניהול הרשאות מערכת</h1>
        <p className="text-slate-500">ניהול הרשאות וגישה לעובדים במערכת Sola.</p>
      </div>
      
      <PermissionsTable 
        employees={employees} 
        permissions={permissions} 
        onTogglePermission={togglePermission} 
      />
    </div>
  );
};

export default AdminPage;