import { api } from './api.js';

export const listMeetings = async () => {
  const res = await api.get('/api/meetings');
  return { data: res.data.meetings, message: res.api?.message };
};

export const getMeeting = async (id) => {
  const res = await api.get(`/api/meetings/${id}`);
  return { data: res.data.meeting, message: res.api?.message };
};

export const getAnalytics = async (id) => {
  const res = await api.get(`/api/meetings/${id}/analytics`);
  return { data: res.data.analytics, message: res.api?.message };
};

export const createMeeting = async (payload) => {
  const res = await api.post('/api/meetings', payload);
  return { data: res.data.meeting, message: res.api?.message };
};

export const deleteMeeting = async (id) => {
  const res = await api.delete(`/api/meetings/${id}`);
  return { data: res.data.meeting, message: res.api?.message };
};

export const updateMeeting = async (id, payload) => {
  const res = await api.put(`/api/meetings/${id}`, payload);
  return { data: res.data.meeting, message: res.api?.message };
};
