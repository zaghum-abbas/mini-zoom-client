import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as meetingService from '../services/meetingService.js';
import { useMeetingSocket } from '../hooks/useMeetingSocket.js';
import toast from 'react-hot-toast';

export function MeetingDetailPage() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const live = useMeetingSocket(id);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, a] = await Promise.all([meetingService.getMeeting(id), meetingService.getAnalytics(id)]);
        if (!cancelled) {
          setMeeting(m.data);
          setAnalytics(a.data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err?.api?.message || err.response?.data?.message || 'Failed to load meeting';
          toast.error(msg);
          setError(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
        <Link to="/">Back</Link>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="page muted" style={{ padding: '2rem' }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="page">
      <p className="muted small">
        <Link to="/">← Meetings</Link>
      </p>
      <div className="page-header">
        <div>
          <h1>{meeting.topic}</h1>
          <p className="muted">
            Status: <span className="badge">{live.status || meeting.status}</span>
          </p>
        </div>
        <div className="row">
          <a className="btn btn-primary" href={meeting.joinUrl} target="_blank" rel="noreferrer">
            Open join URL
          </a>
          {meeting.startUrl ? (
            <a className="btn btn-secondary" href={meeting.startUrl} target="_blank" rel="noreferrer">
              Host start URL
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Details</h2>
          <dl className="kv">
            <dt>Zoom meeting ID</dt>
            <dd>{meeting.zoomMeetingId}</dd>
            <dt>Password</dt>
            <dd>{meeting.password || '—'}</dd>
            <dt>Scheduled</dt>
            <dd>{meeting.startTime ? new Date(meeting.startTime).toLocaleString() : 'Instant'}</dd>
            <dt>Created by</dt>
            <dd>{meeting.createdBy?.email || '—'}</dd>
          </dl>
        </div>

        <div className="card">
          <h2>Live activity</h2>
          <p className="muted small">Updates when Zoom sends participant webhooks to your backend.</p>
          {live.events.length === 0 ? (
            <p className="muted">No live events yet. Open the meeting and enable webhooks.</p>
          ) : (
            <ul className="event-list">
              {live.events.map((ev, idx) => (
                <li key={`${ev.at}-${idx}`}>
                  <strong>{ev.label}</strong>{' '}
                  <span className="muted small">{new Date(ev.at).toLocaleTimeString()}</span>
                  <pre className="small mono">{JSON.stringify(ev.payload, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {analytics ? (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2>Analytics</h2>
          <div className="grid-3">
            <div>
              <div className="muted small">Started</div>
              <div>{analytics.startedAt ? new Date(analytics.startedAt).toLocaleString() : '—'}</div>
            </div>
            <div>
              <div className="muted small">Ended</div>
              <div>{analytics.endedAt ? new Date(analytics.endedAt).toLocaleString() : '—'}</div>
            </div>
            <div>
              <div className="muted small">Duration</div>
              <div>{analytics.durationSeconds ? `${Math.round(analytics.durationSeconds / 60)} min` : '—'}</div>
            </div>
            <div>
              <div className="muted small">Peak participants</div>
              <div>{analytics.peakParticipants}</div>
            </div>
          </div>

          <h3 className="mt">Participant sessions</h3>
          {analytics.participantSessions?.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Joined</th>
                  <th>Left</th>
                </tr>
              </thead>
              <tbody>
                {analytics.participantSessions.map((s, i) => (
                  <tr key={`${s.participantId}-${i}`}>
                    <td>{s.userName || s.participantId}</td>
                    <td>{s.joinedAt ? new Date(s.joinedAt).toLocaleString() : '—'}</td>
                    <td>{s.leftAt ? new Date(s.leftAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">No participant rows yet.</p>
          )}

          <h3 className="mt">Event log (sample)</h3>
          <ul className="event-list">
            {(analytics.eventLogs || []).slice(-15).map((ev, idx) => (
              <li key={idx}>
                <code>{ev.type}</code> <span className="muted small">{new Date(ev.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
