import { useState } from 'react';
import * as meetingService from '../../services/meetingService.js';
import toast from 'react-hot-toast';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Label } from '../ui/label.jsx';
import { Card } from '../ui/card.jsx';

export function CreateMeetingForm({ onCreated }) {
  const [topic, setTopic] = useState('');
  const [agenda, setAgenda] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [inviteesText, setInviteesText] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanTopic = topic.trim();
      if (!cleanTopic) {
        toast.error('Topic is required');
        return;
      }
      const invitees = inviteesText
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        topic: cleanTopic,
        agenda,
        durationMinutes: Number(durationMinutes) || 60,
        invitees: invitees.length ? invitees : undefined,
      };
      if (startTime) {
        payload.startTime = new Date(startTime).toISOString();
      }
      const res = await meetingService.createMeeting(payload);
      setTopic('');
      setAgenda('');
      setStartTime('');
      setInviteesText('');
      onCreated?.(res.data);
      toast.success(res.message || 'Meeting created successfully');
    } catch (err) {
      toast.error(err?.api?.message || err.response?.data?.message || 'Could not create meeting');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2>Create Zoom meeting</h2>
      <p className="muted small">Admin only — provisions a meeting on your Zoom account.</p>
      <form className="form" onSubmit={onSubmit}>
        <Label>
          Topic
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} required />
        </Label>
        <Label>
          Agenda
          <Textarea rows={2} value={agenda} onChange={(e) => setAgenda(e.target.value)} />
        </Label>
        <div className="grid-2">
          <Label>
            Start (optional)
            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Label>
          <Label>
            Duration (minutes)
            <Input
              type="number"
              min={1}
              max={1440}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </Label>
        </div>
        <Label>
          Invitees (emails, comma or newline separated)
          <Textarea
            rows={3}
            value={inviteesText}
            onChange={(e) => setInviteesText(e.target.value)}
            placeholder="alice@example.com, bob@example.com"
          />
        </Label>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create meeting'}
        </Button>
      </form>
    </Card>
  );
}
