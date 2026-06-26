import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: 'customer' | 'staff' | 'manager' | 'admin';
  loyalty?: {
    totalPoints: number;
    availablePoints: number;
    lifetimePoints: number;
    referralCode: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (details: any) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('brew_nest_token'));
  const [loading, setLoading] = useState(true);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('brew_nest_token', token);
    } else {
      localStorage.removeItem('brew_nest_token');
    }
  }, [token]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [token]);

  const checkAuth = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const freshUser = await api.get<User>('/auth/me');
      setUser(freshUser);
    } catch (err) {
      // Token is invalid/expired
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post<{ user: User; accessToken: string }>('/auth/login', {
        email,
        password,
      });
      setToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (details: any) => {
    setLoading(true);
    try {
      const data = await api.post<{ user: User; accessToken: string }>('/auth/register', details);
      setToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors, clear local state anyway
    } finally {
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfile = async (details: any) => {
    try {
      const updatedUser = await api.put<User>('/users/profile', details);
      setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
