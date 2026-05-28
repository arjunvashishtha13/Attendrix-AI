import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('attendrix_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      localStorage.removeItem('attendrix_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('attendrix_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    localStorage.setItem('attendrix_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('attendrix_token');
      setUser(null);
    }
  };

  const setToken = (token) => {
    localStorage.setItem('attendrix_token', token);
    return loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setToken, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
