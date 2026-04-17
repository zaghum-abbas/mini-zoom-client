import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext.jsx';

const socketBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000`;
};

export const useMeetingSocket = (meetingId) => {
  const { token } = useAuth();
  const [live, setLive] = useState({ participants: [], status: null, events: [] });

  useEffect(() => {
    if (!meetingId || !token) return undefined;

    const socket = io(socketBaseUrl(), {
      transports: ['websocket'],
      auth: { token },
    });

    const pushEvent = (label, payload) => {
      setLive((prev) => ({
        ...prev,
        events: [{ label, payload, at: new Date().toISOString() }, ...prev.events].slice(0, 50),
      }));
    };

    socket.on('connect', () => {
      socket.emit('meeting:subscribe', meetingId);
    });

    socket.on('participant:joined', (payload) => {
      setLive((prev) => ({
        ...prev,
        participants: [...prev.participants, payload],
      }));
      pushEvent('Joined', payload);
    });

    socket.on('participant:left', (payload) => {
      pushEvent('Left', payload);
    });

    socket.on('meeting:status', (payload) => {
      setLive((prev) => ({ ...prev, status: payload.status }));
      pushEvent('Status', payload);
    });

    return () => {
      socket.emit('meeting:unsubscribe', meetingId);
      socket.disconnect();
    };
  }, [meetingId, token]);

  return live;
};
