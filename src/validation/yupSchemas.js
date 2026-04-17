import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().trim().min(2, 'Name is too short').max(60, 'Name is too long').required('Name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const createMeetingSchema = yup.object({
  topic: yup.string().trim().min(2, 'Topic is too short').max(200, 'Topic is too long').required('Topic is required'),
  agenda: yup.string().trim().max(2000, 'Agenda is too long').nullable(),
  startTime: yup
    .string()
    .nullable()
    .test('not-in-past', 'Start time cannot be in the past', (value) => {
      if (!value) return true;
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return false;
      return d.getTime() >= Date.now();
    }),
  durationMinutes: yup
    .number()
    .transform((val, originalValue) => (originalValue === '' || originalValue == null ? undefined : val))
    .typeError('Duration must be a number')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 1440 minutes')
    .required('Duration is required'),
  inviteesText: yup
    .string()
    .nullable()
    .test('invitees-emails', 'Enter valid invitee emails', (value) => {
      if (!value) return true;
      const parts = value
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 0) return true;
      return parts.every((email) => yup.string().email().isValidSync(email));
    }),
});

