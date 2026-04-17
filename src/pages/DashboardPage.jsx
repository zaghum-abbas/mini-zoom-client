import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import * as meetingService from '../services/meetingService.js';
import { CreateMeetingForm } from '../components/meetings/CreateMeetingForm.jsx';
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
import { Edit, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await meetingService.listMeetings();
      setMeetings(res.data);
    } catch (err) {
      const msg = err?.api?.message || err.response?.data?.message || 'Failed to load meetings';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDelete = (meeting) => {
    setSelectedMeeting(meeting);
    setConfirmOpen(true);``
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
  };

  const handleDelete = async () => {
    if (!selectedMeeting?._id) return;
    setDeleting(true);
    try {
      const res = await meetingService.deleteMeeting(selectedMeeting._id);
      toast.success(res?.message || 'Meeting deleted');
      if (res?.data?._id) {
        setMeetings((prev) => prev.filter((m) => m._id !== res.data._id));
      } else {
        setMeetings((prev) => prev.filter((m) => m._id !== selectedMeeting._id));
      }
      setConfirmOpen(false);
      setSelectedMeeting(null);
    } catch (err) {
      const msg = err?.api?.message || err.response?.data?.message || 'Failed to delete meeting';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight  text-white">Meetings</h1>
      </div>

      {error ? (
        <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {user?.role === 'admin' ? (
        <div className="mb-8">
          <CreateMeetingForm
            meeting={editingMeeting}
            onCancel={() => setEditingMeeting(null)}
            onCreated={() => load()}
            onUpdated={(updated) => {
              setMeetings((prev) => prev.map((m) => (m._id === updated?._id ? updated : m)));
              setEditingMeeting(null);
            }}
          />
        </div>
      ) : null}

      <Card className="w-full">
        <CardHeader className="pb-0">
          <CardTitle>Your meetings</CardTitle>
          <CardDescription>Your upcoming and past Zoom meetings.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner size={24} />
              <span className="sr-only">Loading meetings…</span>
            </div>
          ) : meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No meetings yet.</p>
          ) : (
            <ul className="mt-1 divide-y divide-border rounded-lg border border-border">
              {meetings?.map((m) => (
                <li key={m._id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <Link
                      to={`/meetings/${m._id}`}
                      className="block truncate font-medium text-foreground hover:underline"
                    >
                      {m.topic}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Status:{' '}
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-medium text-foreground/80">
                          {m.status}
                        </span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">Zoom ID: {m.zoomMeetingId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">

                  <Button asChild variant="secondary" className="shrink-0">
                    <Link to={m.joinUrl} target="_blank" rel="noreferrer">
                      Join
                    </Link>
                  </Button>
<div className='cursor-pointer' onClick={() => handleEdit(m)}>
  <Edit className="w-4 h-4"/>
</div>

<div className='cursor-pointer' onClick={() => openDelete(m)}>
  <Trash className="w-4 h-4 text-red-500"/>
</div>



                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={(v) => (deleting ? null : setConfirmOpen(v))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete meeting?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this meeting{selectedMeeting?.topic ? ` (“${selectedMeeting.topic}”)` : ''}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size={16} />
                  Deleting…
                  </span>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
