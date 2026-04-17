import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(() => !localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (email, password) => {
    const { data, message } = await authService.login({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setReady(false);
    setToken(data.token);
    setUser(data.user);
    setReady(true);
    return { data, message };
  }, []);

  const register = useCallback(async (payload) => {
    const { data, message } = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    setReady(false);
    setToken(data.token);
    setUser(data.user);
    setReady(true);
    return { data, message };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setReady(true);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;
    const { data } = await authService.me(token);
    setUser(data.user);
  }, [token]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setReady(true);
      return undefined;
    }
    setReady(false);
    let cancelled = false;
    authService
      .me(token)
      .then(({ data }) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshMe,
    }),
    [token, user, ready, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
