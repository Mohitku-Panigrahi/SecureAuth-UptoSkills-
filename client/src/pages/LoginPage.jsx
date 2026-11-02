import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { MascotScene } from '../components/MascotScene';
import { Notification } from '../components/Notification';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const { login, savePendingEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.data?.success && res.data?.user) {
        login(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.status === 403 && err.data?.requiresVerification) {
        savePendingEmail(err.data.email || email);
        navigate('/verify-email', {
          state: {
            email: err.data.email || email,
            notice: 'Please verify your email address to continue.'
          }
        });
        return;
      }
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-peach-glow text-gray-800 flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans relative overflow-x-hidden selection:bg-brand-200 selection:text-brand-700">
      {/* Ambient decorative floating orbs */}
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#f8be9a]/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-12 right-20 w-80 h-80 rounded-full bg-[#fedcc5]/60 blur-2xl pointer-events-none -z-10"></div>

      {/* Main Container */}
      <main className="w-full max-w-6xl glass-backdrop-panel rounded-[36px] sm:rounded-[48px] p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden my-auto" data-purpose="authentication-stage">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Form Card */}
          <section className="lg:col-span-5 w-full flex justify-center" data-purpose="login-form-wrapper">
            <div className="w-full max-w-md form-card-glass rounded-[32px] p-6 sm:p-9 shadow-glass relative">
              {/* Brand Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md text-white font-bold text-lg">
                    <i className="fa-solid fa-feather-pointed"></i>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-semibold text-brand-600 block leading-tight">Identity Suite</span>
                    <span className="font-display text-lg font-bold text-stone-800 leading-none">SecureAuth</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100/80 px-2.5 py-1 rounded-full border border-stone-200/60">
                  <i className="fa-solid fa-shield-halved text-emerald-500 text-xs"></i> 256-bit
                </span>
              </div>

              {/* Title Block */}
              <div className="mb-6">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">Login</h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">Sign in to manage and securely access your portal</p>
              </div>

              {error && (
                <div className="mb-4">
                  <Notification type="error" message={error} onClose={() => setError('')} />
                </div>
              )}

              {notice && (
                <div className="mb-4">
                  <Notification type="info" message={notice} onClose={() => setNotice('')} />
                </div>
              )}

              {/* Sign-in Form */}
              <form onSubmit={handleSubmit} className="space-y-4" data-purpose="login-form">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 ml-1" htmlFor="email">Email</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="username@gmail.com"
                      className="w-full bg-white/90 border border-stone-200/90 rounded-2xl py-3 px-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all shadow-sm"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 ml-1" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white/90 border border-stone-200/90 rounded-2xl py-3 px-4 pr-11 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                    >
                      <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-sm`}></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 hover:text-stone-900">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="font-medium text-stone-600 hover:text-brand-600 transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-500 via-orange-500 to-brand-600 hover:from-brand-600 hover:to-orange-600 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-btn hover:shadow-lg active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group text-sm sm:text-base cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-spinner fa-spin"></i> Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <i className="fa-solid fa-arrow-right-long text-xs transition-transform duration-200 group-hover:translate-x-1"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login Options */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200/80"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-white/80 px-3 text-stone-500 rounded-full font-medium">Or Continue With</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3.5" data-purpose="social-auth-options">
                <button
                  type="button"
                  onClick={() => setNotice('Enterprise SSO provider active. Use standard credentials for UpToSkills workspace.')}
                  className="w-12 h-10 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 shadow-sm flex items-center justify-center text-stone-700 hover:border-stone-300 transition-all active:scale-95"
                  title="Sign in with Google"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" fill="#4285F4"></path>
                    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                    <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                    <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setNotice('GitHub OAuth linked to UpToSkills repository.')}
                  className="w-12 h-10 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 shadow-sm flex items-center justify-center text-stone-800 hover:border-stone-300 transition-all active:scale-95"
                  title="Sign in with GitHub"
                >
                  <i className="fa-brands fa-github text-base"></i>
                </button>
              </div>

              {/* Registration Link */}
              <div className="mt-6 text-center">
                <p className="text-xs text-stone-600">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="font-bold text-stone-900 hover:text-brand-600 transition-colors ml-0.5 underline-offset-2 hover:underline">
                    Register for free
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* Right Mascot Scene */}
          <MascotScene />

        </div>
      </main>
    </div>
  );
};
