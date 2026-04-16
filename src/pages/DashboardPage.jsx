import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import * as meetingService from '../services/meetingService.js';
import { CreateMeetingForm } from '../components/meetings/CreateMeetingForm.jsx';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await meetingService.listMeetings();
      setMeetings(res.data);
    } catch (err) {
      const msg = err?.api?.message || err.response?.data?.message || 'Failed to load meetings';
      toast.error(msg);
      setError(msg);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Meetings</h1>
          <p className="muted">Join links, analytics, and live activity from Zoom webhooks.</p>
        </div>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {user?.role === 'admin' ? (
        <div className="stack" style={{ marginBottom: '2rem' }}>
          <CreateMeetingForm onCreated={() => load()} />
        </div>
      ) : null}

      <div className="card">
        <h2>Your meetings</h2>
        {meetings.length === 0 ? (
          <p className="muted">No meetings yet.</p>
        ) : (
          <ul className="meeting-list">
            {meetings.map((m) => (
              <li key={m._id} className="meeting-list__item">
                <div>
                  <Link to={`/meetings/${m._id}`}>{m.topic}</Link>
                  <div className="muted small">
                    Status: <span className="badge">{m.status}</span> · Zoom ID: {m.zoomMeetingId}
                  </div>
                </div>
                <a className="btn btn-secondary" href={m.joinUrl} target="_blank" rel="noreferrer">
                  Join
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
