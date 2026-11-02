import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Notification } from '../components/Notification';

export const AccountSecurityPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });

      if (res.data?.success) {
        setSuccess('Password updated successfully! Next session will require your updated credentials.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to change password. Ensure current password is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion.');
      return;
    }

    setDeleting(true);
    try {
      const res = await authApi.deleteAccount();
      if (res.data?.success) {
        await logout();
        navigate('/login', {
          state: { notice: 'Your account and credentials have been permanently deleted from MongoDB.' }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface relative min-h-screen selection:bg-primary-container selection:text-on-primary">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-[140px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-container/15 blur-[160px]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-tertiary-container/10 blur-[130px]"></div>
      </div>

      <Sidebar />

      <div className="pl-72">
        <Header />

        <main className="relative pt-20 w-full px-8 bg-transparent min-h-screen pb-16">
          <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col gap-2 pt-2 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs">
                <span>Console</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>Security Engine</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-semibold">Account Security</span>
              </div>
              <div>
                <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Security &amp; Credentials
                </h1>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                  Audit authentication posture, update cryptographic passwords, and manage account destruction.
                </p>
              </div>
            </div>

            {error && (
              <div>
                <Notification type="error" message={error} onClose={() => setError('')} />
              </div>
            )}

            {success && (
              <div>
                <Notification type="success" message={success} onClose={() => setSuccess('')} />
              </div>
            )}

            {/* Security Posture Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-container/20 text-primary">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Password Hash</p>
                    <p className="text-sm font-bold text-on-surface">bcrypt (12 rounds)</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-tertiary-container/20 text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">cookie</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Session Carrier</p>
                    <p className="text-sm font-bold text-on-surface">HTTP-only Cookie</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">2FA Safeguard</p>
                    <p className="text-sm font-bold text-on-surface">Email OTP Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
                <div>
                  <h2 className="text-base font-bold text-on-surface">Change Password</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Enter your current password followed by your desired new passphrase.
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[24px]">key</span>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      required
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
                    >
                      <i className={`fa-regular ${showCurrent ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="newPassword">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNew ? 'text' : 'password'}
                        required
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Min. 8 chars, 1 uppercase, 1 digit"
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
                      >
                        <i className={`fa-regular ${showNew ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="confirmNewPassword">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type={showNew ? 'text' : 'password'}
                      required
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat new password"
                      className="w-full h-11 px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-primary-container hover:bg-orange-600 text-white font-semibold transition-all shadow-btn flex items-center gap-2 text-xs cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span><i className="fa-solid fa-spinner fa-spin mr-1.5"></i> Updating Password...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone: Account Deletion */}
            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-rose-300">Danger Zone — Permanent Account Deletion</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Permanently delete your user document and all security OTP verification records from MongoDB.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all font-label-md text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container rounded-2xl p-6 border border-rose-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <h3 className="text-lg font-bold text-on-surface">Confirm Account Deletion</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This action cannot be undone. It will permanently remove your user record (<span className="text-on-surface font-semibold">{user?.email}</span>) and revoke all active sessions.
            </p>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1" htmlFor="deleteConfirm">
                Type <span className="text-rose-400 font-bold">DELETE</span> to confirm:
              </label>
              <input
                id="deleteConfirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full h-10 px-3 rounded-xl bg-surface-container-highest text-on-surface text-sm border border-white/10 outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface-variant text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
