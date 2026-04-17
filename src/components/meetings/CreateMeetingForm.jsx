import * as meetingService from '@/services/meetingService.js';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Formik } from 'formik';
import { createMeetingSchema } from '@/validation/yupSchemas.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';

const toDateTimeLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

export const CreateMeetingForm = ({ onCreated, meeting, onUpdated, onCancel }) => {
  const minStartDateTimeLocal = (() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  })();

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const cleanTopic = (values.topic).trim();
      const invitees = (values.inviteesText)
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        topic: cleanTopic,
        agenda: values.agenda,
        durationMinutes: Number(values.durationMinutes) || 60,
        invitees: invitees.length ? invitees : undefined,
      };
      if (values.startTime) {
        payload.startTime = new Date(values.startTime).toISOString();
      }
      if (meeting?._id) {
        const res = await meetingService.updateMeeting(meeting._id, payload);
        onUpdated?.(res.data);
        toast.success(res.message);
      } else {
        const res = await meetingService.createMeeting(payload);
        onCreated?.(res.data);
        resetForm();
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <CardTitle>{meeting?._id ? 'Edit Zoom meeting' : 'Create Zoom meeting'}</CardTitle>
        <CardDescription>
          {meeting?._id ? 'Admin only — updates the meeting on your Zoom account.' : 'Admin only — provisions a meeting on your Zoom account.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            topic: meeting?.topic || '',
            agenda: meeting?.agenda || '',
            startTime: meeting?.startTime ? toDateTimeLocal(meeting.startTime) : '',
            durationMinutes: meeting?.durationMinutes || 60,
            inviteesText: Array.isArray(meeting?.invitees) ? meeting.invitees.join('\n') : '',
          }}
          validationSchema={createMeetingSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input
                label="Topic"
                name="topic"
                value={values.topic}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.topic}
                touched={touched.topic}
              />

              <div className="grid gap-1.5">
                <Label htmlFor="agenda" className="flex flex-col items-start gap-1">
                  Agenda
                </Label>
                <Textarea
                  id="agenda"
                  name="agenda"
                  rows={3}
                  value={values.agenda}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.agenda && errors.agenda ? (
                  <span className="text-xs text-destructive">{errors.agenda}</span>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Start (optional)"
                  type="datetime-local"
                  min={meeting?._id ? undefined : minStartDateTimeLocal}
                  name="startTime"
                  value={values.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.startTime}
                  touched={touched.startTime}
                />

                <Input
                  label="Duration (minutes)"
                  type="number"
                  name="durationMinutes"
                  min={1}
                  max={1440}
                  value={values.durationMinutes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.durationMinutes}
                  touched={touched.durationMinutes}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="inviteesText" className="flex flex-col items-start gap-1">
                  Invitees (emails, comma or newline separated)
                </Label>
                <Textarea
                  id="inviteesText"
                  name="inviteesText"
                  rows={3}
                  value={values.inviteesText}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="alice@example.com, bob@example.com"
                />
                {touched.inviteesText && errors.inviteesText ? (
                  <span className="text-xs text-destructive">{errors.inviteesText}</span>
                ) : null}
              </div>

              <CardFooter className="mt-1 justify-end">
                {meeting?._id ? (
                  <Button type="button" variant="outline" onClick={() => onCancel?.()} disabled={isSubmitting}>
                    Cancel
                  </Button>
                ) : null}
                <Button type="submit" disabled={isSubmitting}>
                  {meeting?._id ? (isSubmitting ? 'Updating…' : 'Update meeting') : isSubmitting ? 'Creating…' : 'Create meeting'}
                </Button>
              </CardFooter>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
