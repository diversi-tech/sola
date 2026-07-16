import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuthService } from '../features/login/api/authService';

// The "ניהול" (management) entry. Checks the user's permission up front so an
// unauthorized user gets a clear message instead of being silently bounced
// back by AdminRoute.
export const ManageButton: React.FC = () => {
  const navigate = useNavigate();
  const [canManage, setCanManage] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    localAuthService
      .getMyPermissions()
      .then((perms) => {
        if (active) setCanManage(perms.includes('MANAGE_DASHBOARD'));
      })
      .catch(() => {
        if (active) setCanManage(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleClick = () => {
    if (canManage === false) {
      alert('אין לך הרשאה לגשת לאזור הניהול.');
      return;
    }
    navigate('/admin');
  };

  return (
    <button
      onClick={handleClick}
      disabled={canManage === null}
      title={canManage === false ? 'אין לך הרשאה לגשת לאזור הניהול' : undefined}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
        canManage === false
          ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
      } disabled:opacity-60`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      ניהול
    </button>
  );
};
