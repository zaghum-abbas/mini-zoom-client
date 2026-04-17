import { api } from './api.js';

export const login = async ({ email, password }) => {
  const res = await api.post('/api/auth/login', { email, password });
  return { data: res.data, message: res.api?.message };
};

export const register = async ({ email, password, name }) => {
  const res = await api.post('/api/auth/register', { email, password, name });
  return { data: res.data, message: res.api?.message };
};

export const me = async (token) => {
  const res = await api.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { data: res.data, message: res.api?.message };
};
