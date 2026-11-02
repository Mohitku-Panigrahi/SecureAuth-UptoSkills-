import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const DatabaseViewerPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');

  const fetchDatabase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/admin/database');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch database records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface relative min-h-screen selection:bg-primary-container selection:text-on-primary">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-[140px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-container/15 blur-[160px]"></div>
      </div>

      <Sidebar />

      <div className="pl-72">
        <Header />

        <main className="relative pt-20 w-full px-8 bg-transparent min-h-screen pb-16">
          <div className="flex flex-col w-full max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                  <span>Console</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-primary font-semibold">MongoDB Transparency Hub</span>
                </div>
                <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Live Database Inspector
                </h1>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                  Real-time visualization of documents stored in MongoDB collections for internship presentation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDatabase}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-all flex items-center gap-2 border border-white/5 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
                  <span>Refresh Data</span>
                </button>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-code-mono text-tertiary">
                    {data?.databaseName || 'secureauth'} ({data?.connectionStatus || 'Connected'})
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5">
                <p className="text-xs text-on-surface-variant font-medium">Database Target</p>
                <p className="text-base font-bold text-on-surface mt-0.5 font-code-mono text-primary">
                  {data?.databaseName || 'secureauth'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5">
                <p className="text-xs text-on-surface-variant font-medium">Total Registered Users</p>
                <p className="text-xl font-bold text-on-surface mt-0.5 font-code-mono">
                  {data?.stats?.totalUsers ?? 0}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5">
                <p className="text-xs text-on-surface-variant font-medium">Active OTP Records</p>
                <p className="text-xl font-bold text-tertiary mt-0.5 font-code-mono">
                  {data?.stats?.totalOtpRecords ?? 0}
                </p>
              </div>
            </div>

            {/* Collection Switcher Tabs */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-primary-container text-white shadow-md'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span>users ({data?.collections?.users?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('otps')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'otps'
                    ? 'bg-primary-container text-white shadow-md'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">pin</span>
                <span>otpverifications ({data?.collections?.otpverifications?.length || 0})</span>
              </button>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {activeTab === 'users' && (
                <>
                  {data?.collections?.users?.length === 0 ? (
                    <div className="p-8 text-center bg-surface-container/40 rounded-2xl border border-white/5 text-on-surface-variant text-xs">
                      No user documents found yet. Register an account to see documents appear here in real-time.
                    </div>
                  ) : (
                    data?.collections?.users?.map((u) => (
                      <div
                        key={u._id}
                        className="p-5 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="font-code-mono text-xs text-primary font-bold">{u._id}</span>
                            <span className="text-on-surface font-semibold text-sm">({u.name})</span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              u.isEmailVerified
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            isEmailVerified: {String(u.isEmailVerified)}
                          </span>
                        </div>

                        <pre className="p-3.5 rounded-xl bg-surface-container-lowest font-code-mono text-xs text-on-surface overflow-x-auto leading-relaxed border border-white/5">
{JSON.stringify(u, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'otps' && (
                <>
                  {data?.collections?.otpverifications?.length === 0 ? (
                    <div className="p-8 text-center bg-surface-container/40 rounded-2xl border border-white/5 text-on-surface-variant text-xs">
                      No active OTP records. Request a verification code or reset password to view OTP records.
                    </div>
                  ) : (
                    data?.collections?.otpverifications?.map((o) => (
                      <div
                        key={o._id}
                        className="p-5 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <span className="font-code-mono text-xs text-tertiary font-bold">{o._id}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-code-mono">
                            Purpose: {o.purpose}
                          </span>
                        </div>

                        <pre className="p-3.5 rounded-xl bg-surface-container-lowest font-code-mono text-xs text-on-surface overflow-x-auto leading-relaxed border border-white/5">
{JSON.stringify(o, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
