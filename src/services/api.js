import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => {
    const body = response?.data;
    if (body && typeof body === 'object' && 'status' in body && 'data' in body) {
      if (body.status === false) {
        const err = new Error(body.message || 'Request failed');
        err.response = response;
        err.api = body;
        throw err;
      }
      response.data = body.data;
      response.api = { status: body.status, message: body.message };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
