import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState(() => {
    return sessionStorage.getItem('secureauth_pending_email') || '';
  });

  const checkAuth = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    sessionStorage.removeItem('secureauth_pending_email');
    setPendingEmail('');
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      sessionStorage.clear();
    }
  };

  const savePendingEmail = (email) => {
    setPendingEmail(email);
    if (email) {
      sessionStorage.setItem('secureauth_pending_email', email);
    } else {
      sessionStorage.removeItem('secureauth_pending_email');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        pendingEmail,
        savePendingEmail,
        login: loginUser,
        logout: logoutUser,
        refreshUser,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
