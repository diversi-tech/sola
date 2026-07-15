import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import { localAuthService } from '../features/login/api/authService';

interface AdminRouteProps {
  children: React.ReactElement;
}

// Permissions are checked live against the backend on entry (not from a cached
// copy), so the gate is always current and works regardless of how the user
// logged in. The backend still enforces the permission on every admin request;
// this only decides whether to render the page or redirect away.
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    if (!isAuthenticated()) {
      setStatus('denied');
      return;
    }

    let active = true;
    localAuthService
      .getMyPermissions()
      .then((permissions) => {
        if (active) setStatus(permissions.includes('MANAGE_DASHBOARD') ? 'allowed' : 'denied');
      })
      .catch(() => {
        if (active) setStatus('denied');
      });

    return () => {
      active = false;
    };
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (status === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/EmployeePage" replace />;
  }

  return children;
};
