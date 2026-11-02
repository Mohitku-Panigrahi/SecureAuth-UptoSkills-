import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'My Profile', path: '/profile', icon: 'person' },
    { name: 'Account Security', path: '/security', icon: 'security' },
    { name: 'DB Inspector', path: '/database', icon: 'database' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low/85 backdrop-blur-xl z-50 flex flex-col justify-between py-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-white/5">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="px-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md text-white font-bold text-lg">
            <span className="material-symbols-outlined text-[22px]">shield_lock</span>
          </div>
          <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold">SecureAuth</span>
        </div>

        {/* Mesh Badge */}
        <div className="px-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 w-fit">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-semibold">Zero-Trust Mesh</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-container text-white font-semibold shadow-md shadow-primary-container/20'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
};
