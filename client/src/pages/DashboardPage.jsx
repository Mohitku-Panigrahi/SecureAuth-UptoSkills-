import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  const passwordAgeDays = user?.passwordChangedAt
    ? Math.max(0, Math.floor((Date.now() - new Date(user.passwordChangedAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="bg-surface font-body-md text-on-surface relative min-h-screen selection:bg-primary-container selection:text-on-primary">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-[140px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-container/15 blur-[160px]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-tertiary-container/10 blur-[130px]"></div>
      </div>

      <Sidebar />

      <div className="pl-72">
        <Header />

        <main className="relative pt-20 w-full px-8 bg-transparent min-h-screen pb-16">
          <div className="flex flex-col w-full max-w-6xl mx-auto space-y-8">
            
            {/* Top Hero Section */}
            <header className="relative w-full pt-4 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5">
              <div className="flex flex-col gap-3">
                {/* Attribution & Status Pills */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/90 shadow-sm text-tertiary border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                    <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">
                      SecureAuth Internship Project • UpToSkills
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span className="font-label-sm text-xs tracking-wide font-semibold uppercase">
                      {user?.isEmailVerified ? 'Email Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>

                {/* Welcome Typography */}
                <div>
                  <h1 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                    Welcome back, {user?.name || 'Engineer'}!
                  </h1>
                  <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl mt-1">
                    Your authenticated account identity and security posture, verified and persistent in MongoDB.
                  </p>
                </div>
              </div>

              {/* Active Protocol / Account ID Strip */}
              <div className="flex items-center gap-4 bg-surface-container-low/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-md border border-white/5">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Badge Identifier</span>
                  <span className="font-code-mono text-sm text-primary font-bold">
                    {user?.directoryBadgeId || 'SEC-USR-001'}
                  </span>
                </div>
                <div className="w-px h-8 bg-surface-container-highest"></div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Member Since</span>
                  <span className="font-label-md text-xs text-on-surface font-medium">{memberSince}</span>
                </div>
              </div>
            </header>

            {/* Core Bento Information Grid (3 Columns) */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: User Profile Card */}
              <div className="relative group bg-surface-container-low/75 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden border border-white/5">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary-container/20 transition-all duration-500"></div>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-label-sm text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Profile Identity</span>
                    <span className="font-label-sm text-xs px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-medium">
                      Software Intern
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        alt={user?.name || 'Profile Avatar'}
                        className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-primary-container/40"
                        src={user?.profilePicture || defaultAvatar}
                      />
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-surface-container-low flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="font-headline-sm text-base font-bold text-on-surface truncate">{user?.name || 'Alex Morgan'}</h2>
                      <p className="font-body-md text-xs text-on-surface-variant truncate">{user?.email}</p>
                      <span className="font-label-sm text-[11px] text-primary mt-1 truncate">
                        {user?.organizationUnit || 'Engineering Cohort • Team Auth'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="font-body-sm text-xs text-on-surface-variant">MongoDB Synced</span>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors font-label-md text-xs font-semibold"
                  >
                    <span>Edit Profile</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Email Verification Card */}
              <div className="relative group bg-surface-container-low/75 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden border border-white/5">
                <div className="absolute -right-10 -top-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-label-sm text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Primary Channel</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-label-sm text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Verified & Active
                    </span>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
                    </div>
                    <div>
                      <h2 className="font-title-md text-base font-bold text-on-surface">Email Identity Shield</h2>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Your email <span className="text-on-surface font-medium">{user?.email}</span> is verified and guarded with SHA-256 OTP authentication.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="font-body-sm text-xs text-on-surface-variant">Relay: Verified SPF/DKIM</span>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-fixed transition-colors font-label-md text-xs font-semibold"
                  >
                    <span>Manage Details</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Account Security Card */}
              <div className="relative group bg-surface-container-low/75 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden border border-white/5">
                <div className="absolute -right-10 -top-10 w-28 h-28 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none group-hover:bg-secondary-container/30 transition-all duration-500"></div>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-label-sm text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Security Posture</span>
                    <span className="font-label-sm text-xs px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">key</span>
                    </div>
                    <div>
                      <h2 className="font-title-md text-base font-bold text-on-surface">Authentication Stack</h2>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                          <span>Password changed {passwordAgeDays === 0 ? 'today' : `${passwordAgeDays} days ago`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">lock_reset</span>
                          <span>2FA Status: Email OTP Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="font-body-sm text-xs text-on-surface-variant">HTTP-only Cookie JWT</span>
                  <Link
                    to="/security"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors font-label-md text-xs font-semibold"
                  >
                    <span>Security Settings</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

            </section>

            {/* Quick Actions Panel */}
            <section className="bg-surface-container/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
              <h3 className="font-title-md text-sm uppercase tracking-wider font-semibold text-on-surface-variant mb-4">
                Account Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-all border border-white/5 group"
                >
                  <div className="p-2 rounded-lg bg-primary-container/20 text-primary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Edit Profile</p>
                    <p className="text-[11px] text-on-surface-variant">Update personal bio & contacts</p>
                  </div>
                </Link>

                <Link
                  to="/security"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-all border border-white/5 group"
                >
                  <div className="p-2 rounded-lg bg-tertiary-container/20 text-tertiary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">password</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Change Password</p>
                    <p className="text-[11px] text-on-surface-variant">Overwrite existing credentials</p>
                  </div>
                </Link>

                <Link
                  to="/security"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-all border border-white/5 group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Account Security</p>
                    <p className="text-[11px] text-on-surface-variant">Audit cryptographic settings</p>
                  </div>
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-high/60 hover:bg-rose-500/10 transition-all border border-white/5 group text-left cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface group-hover:text-rose-300">Sign Out</p>
                    <p className="text-[11px] text-on-surface-variant">End authenticated session</p>
                  </div>
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};
