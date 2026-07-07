import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../features/login/components/Input';
import { supabase } from '../config/supabaseClient';

export const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        setError('קישור לא תקין או שפג תוקפו. בקש/י קישור חדש.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים.');
      return;
    }
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || 'שגיאה בעדכון הסיסמה.');
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();
    setTimeout(() => navigate('/'), 2000);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-2">הסיסמה עודכנה בהצלחה!</h2>
          <p className="text-slate-500 text-sm">מעביר אותך למסך ההתחברות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full mx-4">
        <h1 className="text-xl font-bold text-slate-900 mb-1">הגדרת סיסמה</h1>
        <p className="text-sm text-slate-500 mb-6">בחר/י סיסמה חדשה לחשבון שלך.</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {sessionReady && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">סיסמה חדשה</label>
              <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">אימות סיסמה</label>
              <Input type="password" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
              שמור סיסמה
            </button>
          </>
        )}
      </form>
    </div>
  );
};