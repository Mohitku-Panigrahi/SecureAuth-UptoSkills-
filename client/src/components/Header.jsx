import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user } = useAuth();

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl shadow-sm z-40 flex items-center justify-between px-8 border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
          <span>Console</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Security Engine</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-semibold tracking-wider">VERIFIED SESSION</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-container-high transition-all">
          <img
            alt={user?.name || 'Profile'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/40"
            src={user?.profilePicture || defaultAvatar}
          />
          <span className="font-label-md text-sm font-medium text-on-surface hidden sm:inline">
            {user?.name || 'User'}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
        </Link>
      </div>
    </header>
  );
};
