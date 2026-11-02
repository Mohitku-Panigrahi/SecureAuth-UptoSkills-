import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Notification } from '../components/Notification';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    location: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profilePicture: '' }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        profilePicture: user.profilePicture || ''
      });
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await authApi.updateProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        dateOfBirth: formData.dateOfBirth || null,
        profilePicture: formData.profilePicture
      });

      if (res.data?.success) {
        setSuccess('Profile updated successfully and persisted to MongoDB.');
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'October 14, 2024';

  return (
    <div className="bg-surface font-body-md text-on-surface relative min-h-screen selection:bg-primary-container selection:text-on-primary">
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-[140px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-container/15 blur-[160px]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-tertiary-container/10 blur-[130px]"></div>
      </div>

      <Sidebar />

      <div className="pl-72">
        <Header />

        <main className="relative pt-20 w-full px-8 bg-transparent min-h-screen pb-16">
          <div className="flex flex-col w-full max-w-6xl mx-auto space-y-6">
            
            {/* Header & Subheader Zone */}
            <div className="flex flex-col gap-2 pt-2 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs">
                <span>Console</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>User Settings</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-semibold">Profile Management</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
                <div>
                  <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                    Identity &amp; Profile
                  </h1>
                  <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                    Manage personal identifiers, cryptographic mesh attributes, and enterprise directory credentials.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low backdrop-blur-md border border-white/5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span className="font-label-sm text-xs text-on-surface-variant">
                    MongoDB Synchronized: <span className="text-tertiary font-medium">Real Persistent Mode</span>
                  </span>
                </div>
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

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: Biometric Portrait & Organization Profile (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Avatar Card */}
                <div className="p-6 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Biometric Portrait</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest font-code-mono text-[11px] text-tertiary font-semibold">
                      {user?.directoryBadgeId || 'ID: AM-8492'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center mt-2">
                    <div className="relative group">
                      <img
                        className="w-32 h-32 rounded-full object-cover shadow-xl ring-4 ring-primary-container/30"
                        alt={user?.name || 'User Portrait'}
                        src={formData.profilePicture || defaultAvatar}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Upload picture"
                        className="absolute bottom-1 right-1 p-2.5 rounded-full bg-primary-container text-white shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      </button>
                    </div>

                    <div className="mt-4">
                      <h2 className="font-headline-sm text-lg font-bold text-on-surface">{user?.name}</h2>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">{user?.organizationUnit || 'Software Engineering Intern'}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-surface-container-high/60 border border-white/5">
                      <span className="material-symbols-outlined text-tertiary text-[16px]">verified_user</span>
                      <span className="font-label-sm text-[11px] text-tertiary font-medium">Session Authenticated</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-xs hover:bg-surface-bright transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                      <span>Upload Picture</span>
                    </button>
                    {formData.profilePicture && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        title="Remove profile image"
                        className="py-2 px-3 rounded-xl bg-surface-container-low text-rose-400 font-label-md text-xs hover:bg-rose-500/10 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant/80 text-center">
                    Accepts PNG, JPG or WEBP up to 2MB. Stored directly with user document.
                  </p>
                </div>

                {/* Organization Details Card */}
                <div className="p-6 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">corporate_fare</span>
                      <h2 className="font-title-md text-sm font-bold text-on-surface">Organization Profile</h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-sm text-[11px] font-semibold">
                      Synced
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wide">Assigned Unit</span>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-xs">
                        <span className="font-medium text-on-surface">Engineering Cohort • Team Auth</span>
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">domain</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wide">Directory Badge ID</span>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-xs">
                        <span className="font-code-mono text-primary font-bold">{user?.directoryBadgeId || 'SEC-8492-AM'}</span>
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">badge</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wide">Cohort Induction</span>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-xs">
                        <span className="font-medium text-on-surface">{joinedDate}</span>
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_today</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 p-2.5 rounded-xl bg-surface-container-lowest/80 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">fingerprint</span>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">Passkey Mesh Score</span>
                    </div>
                    <span className="font-code-mono text-xs text-tertiary font-bold">99.8%</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Editable Form (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="p-6 sm:p-8 rounded-2xl bg-surface-container/70 backdrop-blur-xl border border-white/5 shadow-md flex flex-col gap-6">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <h2 className="font-title-md text-base font-bold text-on-surface">Personal Information</h2>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                        Update profile details, bio, and contact information persisted in the MongoDB users collection.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                      <span>Workspace Managed</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="profileName">
                          Full Name
                        </label>
                        <input
                          id="profileName"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full h-11 px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                        />
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="profileEmail">
                          Email Address (Primary Identity)
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="profileEmail"
                            type="email"
                            readOnly
                            disabled
                            value={user?.email || ''}
                            className="w-full h-11 px-4 rounded-xl bg-surface-container-lowest/80 text-on-surface-variant font-body-md text-sm border border-white/5 cursor-not-allowed opacity-80"
                          />
                          <span className="absolute right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="profilePhone">
                          Phone Number
                        </label>
                        <input
                          id="profilePhone"
                          name="phone"
                          type="text"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 234-5678"
                          className="w-full h-11 px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="profileLocation">
                          Location
                        </label>
                        <input
                          id="profileLocation"
                          name="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="San Francisco, CA"
                          className="w-full h-11 px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="profileDob">
                        Date of Birth
                      </label>
                      <input
                        id="profileDob"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="profileBio">
                        Professional Bio
                      </label>
                      <textarea
                        id="profileBio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Write a brief professional summary about your role and focus..."
                        className="w-full p-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all font-label-md text-xs font-semibold cursor-pointer"
                      >
                        Cancel Changes
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-primary-container hover:bg-orange-600 text-white font-semibold transition-all shadow-btn flex items-center gap-2 text-xs cursor-pointer disabled:opacity-70"
                      >
                        {loading ? (
                          <span><i className="fa-solid fa-spinner fa-spin mr-1.5"></i> Persisting to MongoDB...</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">save</span>
                            <span>Save Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
