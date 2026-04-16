import { api } from './api.js';

export async function listMeetings() {
  const res = await api.get('/api/meetings');
  return { data: res.data.meetings, message: res.api?.message };
}

export async function getMeeting(id) {
  const res = await api.get(`/api/meetings/${id}`);
  return { data: res.data.meeting, message: res.api?.message };
}

export async function getAnalytics(id) {
  const res = await api.get(`/api/meetings/${id}/analytics`);
  return { data: res.data.analytics, message: res.api?.message };
}

export async function createMeeting(payload) {
  const res = await api.post('/api/meetings', payload);
  return { data: res.data.meeting, message: res.api?.message };
}
