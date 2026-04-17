import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as meetingService from '../services/meetingService.js';
import { useMeetingSocket } from '../hooks/useMeetingSocket.js';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.jsx';
import { Spinner } from '../components/ui/spinner.jsx';

export const MeetingDetailPage = () => {
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
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
        <Link to="/" className="text-sm font-medium text-primary hover:underline">
          ← Back to meetings
        </Link>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12">
        <Spinner size={24} />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline">
        ← Meetings
      </Link>

      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{meeting.topic}</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Status:{' '}
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80">
              {live.status || meeting.status}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={meeting.joinUrl} target="_blank" rel="noreferrer">
              Open join URL
            </a>
          </Button>
          {meeting.startUrl ? (
            <Button asChild variant="secondary">
              <a href={meeting.startUrl} target="_blank" rel="noreferrer">
                Host start URL
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="pb-0">
            <CardTitle>Details</CardTitle>
            <CardDescription>Meeting metadata from Zoom.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="mt-1 grid gap-3 text-sm">
              <div className="grid grid-cols-1 gap-1">
                <dt className="text-xs font-medium text-muted-foreground">Zoom meeting ID</dt>
                <dd className="font-medium text-foreground">{meeting.zoomMeetingId}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <dt className="text-xs font-medium text-muted-foreground">Password</dt>
                <dd className="font-medium text-foreground">{meeting.password || '—'}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <dt className="text-xs font-medium text-muted-foreground">Scheduled</dt>
                <dd className="font-medium text-foreground">
                  {meeting.startTime ? new Date(meeting.startTime).toLocaleString() : 'Instant'}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <dt className="text-xs font-medium text-muted-foreground">Created by</dt>
                <dd className="font-medium text-foreground">{meeting.createdBy?.email || '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-0">
            <CardTitle>Live activity</CardTitle>
            <CardDescription>Updates when Zoom sends participant webhooks to your backend.</CardDescription>
          </CardHeader>
          <CardContent>
            {live.events.length === 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                No live events yet. Open the meeting and enable webhooks.
              </p>
            ) : (
              <ul className="mt-1 space-y-4">
                {live.events.map((ev, idx) => (
                  <li key={`${ev.at}-${idx}`} className="rounded-lg border border-border bg-muted/20 p-3">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-medium text-foreground">{ev.label}</span>
                      <span className="text-xs text-muted-foreground">{new Date(ev.at).toLocaleTimeString()}</span>
                    </div>
                    <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted px-3 py-2 text-xs">
                      {JSON.stringify(ev.payload, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {analytics ? (
        <Card className="mt-6 w-full">
          <CardHeader className="pb-0">
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Aggregated session stats from webhook events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="text-xs font-medium text-muted-foreground">Started</div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {analytics.startedAt ? new Date(analytics.startedAt).toLocaleString() : '—'}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="text-xs font-medium text-muted-foreground">Ended</div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {analytics.endedAt ? new Date(analytics.endedAt).toLocaleString() : '—'}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="text-xs font-medium text-muted-foreground">Duration</div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {analytics.durationSeconds ? `${Math.round(analytics.durationSeconds / 60)} min` : '—'}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="text-xs font-medium text-muted-foreground">Peak participants</div>
                <div className="mt-1 text-sm font-medium text-foreground">{analytics.peakParticipants}</div>
              </div>
            </div>

            <h2 className="mt-6 text-base font-semibold tracking-tight text-foreground">Participant sessions</h2>
            {analytics.participantSessions?.length ? (
              <div className="mt-2 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium text-foreground">Name</th>
                      <th className="px-3 py-2 font-medium text-foreground">Joined</th>
                      <th className="px-3 py-2 font-medium text-foreground">Left</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analytics.participantSessions.map((s, i) => (
                      <tr key={`${s.participantId}-${i}`}>
                        <td className="px-3 py-2 text-foreground">{s.userName || s.participantId}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {s.joinedAt ? new Date(s.joinedAt).toLocaleString() : '—'}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {s.leftAt ? new Date(s.leftAt).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No participant rows yet.</p>
            )}

            <h2 className="mt-6 text-base font-semibold tracking-tight text-foreground">Event log (sample)</h2>
            <ul className="mt-2 space-y-2">
              {(analytics.eventLogs || []).slice(-15).map((ev, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground/80">{ev.type}</code>{' '}
                  <span className="text-xs">{new Date(ev.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
