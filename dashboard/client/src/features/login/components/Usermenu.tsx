import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuthService } from '../api/authService';

// Decodes the JWT payload stored in localStorage to read the user's email.
// (There is currently no backend endpoint that returns profile info,
// so we pull it straight out of the token.)
function getUserEmailFromToken(): string {
  try {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const payloadBase64 = token.split('.')[1];
    const payloadJson = JSON.parse(
      decodeURIComponent(
        atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      )
    );
    return payloadJson.email || payloadJson.user_email || '';
  } catch {
    return '';
  }
}

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const email = getUserEmailFromToken();
  const initial = email ? email.charAt(0).toUpperCase() : '?';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localAuthService.logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center text-white text-sm font-bold shadow-sm"
        aria-label="תפריט משתמש"
      >
        {initial}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-30"
          style={{ direction: 'rtl' }}
        >
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-xs text-slate-400 font-medium mb-0.5">מחובר בתור</p>
            <p className="text-sm font-semibold text-white truncate">
              {email || 'לא ידוע'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            התנתקות
          </button>
        </div>
      )}
    </div>
  );
};