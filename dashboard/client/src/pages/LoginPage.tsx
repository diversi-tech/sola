import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../features/login/components/Input';
import logo from '../assets/sola-logo.png';
import { connectWithGoogle, localAuthService } from '../features/login/api/authService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'oauth') {
      setError('Google sign-in failed. Your account may not be registered in the system.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await localAuthService.login(email, password);
      navigate('/EmployeePage'); 
    } catch (err: any) {
      setError(err.message || 'Login error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await connectWithGoogle();
      console.log('Google login successful:', result);
    } catch (error) {
      setError('Login error with Google');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    if (target.parentNode) {
      (target.parentNode as HTMLElement).innerHTML =
        '<span class="text-2xl font-black text-slate-800">sola<span style="color:#4f46e5">.</span></span>';
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Please enter your email address first in the email field.');
      return;
    }

    try {
      await localAuthService.requestPasswordReset(email);
      setSuccessMessage('Password reset link sent successfully to your email!');
    } catch (err: any) {
      setError(err.message || 'Error sending password reset email');
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <div className="flex flex-col w-full lg:w-[46%] bg-white px-8 py-10 lg:px-14">
        <div className="mb-12">
          <img
            src={logo}
            alt="Sola"
            className="h-8 object-contain"
            onError={handleImageError}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center flex-1 max-w-[360px] mx-auto w-full"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
          <p className="text-sm text-slate-500 mb-8">Welcome back! Enter your details to continue.</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full py-2.5 px-4 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              className="!rounded-lg !border-slate-200 focus:!border-indigo-500 focus:!ring-2 focus:!ring-indigo-100 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              className="!rounded-lg !border-slate-200 focus:!border-indigo-500 focus:!ring-2 focus:!ring-indigo-100 text-slate-800"
            />
          </div>

          <div className="flex justify-end mb-6">
            <a 
              href="#" 
              onClick={handleForgotPassword}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-10">
          © 2026 Sola · All rights reserved
        </p>
      </div>

      <div className="hidden lg:flex lg:w-[54%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Manage your team<br />with confidence
          </h2>
          <p className="text-indigo-200 text-base leading-relaxed mb-10">
            One place to track employee performance, monitor meetings, and generate reports — all in real time.
          </p>

          <div className="flex flex-col gap-4 text-left">
            {[
              { icon: '📊', text: 'Real-time employee metrics & reports' },
              { icon: '📅', text: 'Calendar sync & meeting insights' },
              { icon: '🔒', text: 'Secure, role-based access control' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10">
                <span className="text-lg">{icon}</span>
                <span className="text-white/90 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};