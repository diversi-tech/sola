import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../features/login/components/Input';
import Button from '../features/login/components/Button';
import logo from '../assets/sola-logo.png';

//import { connectWithGoogle } from '../features/login/api/authApi';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = async (): Promise<void> => {
    navigate('/EmployeePage');
  };

  const handleGoogleLogin = async () => {
    try {
      //const result = await connectWithGoogle();
      //console.log('Google login successful:', result);
      navigate('/EmployeePage');
    } catch (error) {
      console.error('Failed to login with Google', error);
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

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── Left: Form Panel ── */}
      <div className="flex flex-col w-full lg:w-[46%] bg-white px-8 py-10 lg:px-14">

        {/* Logo */}
        <div className="mb-12">
          <img
            src={logo}
            alt="Sola"
            className="h-8 object-contain"
            onError={handleImageError}
          />
        </div>

        {/* Form — vertically centered */}
        <div className="flex flex-col justify-center flex-1 max-w-[360px] mx-auto w-full">

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
          <p className="text-sm text-slate-500 mb-8">Welcome back! Enter your details to continue.</p>

          {/* Social buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full py-2.5 px-4 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                className="w-4.5 h-4.5 shrink-0"
                alt="Google"
              />
              Continue with Google
            </button>

            <button className="flex items-center justify-center gap-3 w-full py-2.5 px-4 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <svg className="w-4.5 h-4.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="you@company.com"
              className="!rounded-lg !border-slate-200 focus:!border-indigo-500 focus:!ring-2 focus:!ring-indigo-100 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="!rounded-lg !border-slate-200 focus:!border-indigo-500 focus:!ring-2 focus:!ring-indigo-100 text-slate-800"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-6">
            <a href="#" className="text-xs text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign in button */}
          <button
            onClick={handleSignIn}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Sign in
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Create one →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-10">
          © 2026 Sola · All rights reserved
        </p>
      </div>

      {/* ── Right: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[54%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex-col items-center justify-center p-16 relative overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-md text-center">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Manage your team<br />with confidence
          </h2>
          <p className="text-indigo-200 text-base leading-relaxed mb-10">
            One place to track employee performance, monitor meetings, and generate reports — all in real time.
          </p>

          {/* Feature list */}
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
