import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../components/Notification';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { savePendingEmail } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (res.data?.success) {
        savePendingEmail(formData.email);
        navigate('/verify-email', {
          state: {
            email: formData.email,
            notice: res.data.message || 'Verification code dispatched to your email.',
            warning: res.data.warning
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-peach-glow text-gray-800 flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans relative overflow-x-hidden selection:bg-brand-200 selection:text-brand-700">
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#f8be9a]/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-12 right-20 w-80 h-80 rounded-full bg-[#fedcc5]/60 blur-2xl pointer-events-none -z-10"></div>

      <main className="w-full max-w-4xl glass-backdrop-panel rounded-[36px] sm:rounded-[48px] p-4 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden my-auto">
        <div className="relative w-full overflow-hidden rounded-[32px] bg-surface-container-low/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl border border-white/10 text-on-surface">
          
          {/* Header Branding & Security Credential */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-primary-container/30">
                <span className="material-symbols-outlined text-[24px]">shield_person</span>
              </div>
              <div>
                <span className="font-headline-sm text-lg font-bold text-on-surface tracking-tight block">SecureAuth</span>
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Access Platform</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3.5 py-1 text-on-surface border border-white/5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-code-mono text-xs text-tertiary">256-BIT ENCRYPTED</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6">
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Create Account</h1>
            <p className="font-body-md text-sm text-on-surface-variant mt-1.5">Join SecureAuth to safeguard your profile and manage access seamlessly.</p>
          </div>

          {error && (
            <div className="mb-5">
              <Notification type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="name">Full Name</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">person</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="email">Email Address</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex.morgan@uptoskills.com"
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="password">Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">lock</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 chars, 1 uppercase, 1 digit"
                    className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">verified_user</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary-container hover:bg-orange-600 text-white font-semibold rounded-xl shadow-btn hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin"></i> Creating Account & Generating OTP...
                  </span>
                ) : (
                  <>
                    <span>Create Account & Verify Email</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-4">
            <p className="text-xs text-on-surface-variant">
              Already have a SecureAuth account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary-container transition-colors ml-1">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};
