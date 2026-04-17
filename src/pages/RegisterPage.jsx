import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card } from '../components/ui/card.jsx';
import { Formik } from 'formik';
import { registerSchema } from '../validation/yupSchemas.js';
import { useState } from 'react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      const res = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (res?.message) {toast.success(res.message);}
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-10">
      <Card className="w-full px-10">
        <h1 className="text-2xl font-semibold tracking-tight text-center">Create your account</h1>
        <p className="text-sm text-muted-foreground text-center">
          Standard accounts can join meetings created by admins.
        </p>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={registerSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
              {error ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Input
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                touched={touched.name}
                errors={errors.name}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                touched={touched.email}
                errors={errors.email}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                touched={touched.password}
                errors={errors.password}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 2l20 20" />
                        <path d="M6.71 6.71C4.52 8.36 3 10.5 3 12c0 4.5 5.4 8 9 8 1.56 0 3.22-.5 4.77-1.33" />
                        <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                        <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c3.6 0 9 3.5 9 8 0 1.31-.77 2.73-2.02 4.03" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2.06 12.32a1 1 0 0 1 0-.64C3.42 7.51 7.36 4 12 4s8.58 3.51 9.94 7.68a1 1 0 0 1 0 .64C20.58 16.49 16.64 20 12 20s-8.58-3.51-9.94-7.68Z" />
                        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                      </svg>
                    )}
                  </button>
                }
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create account'}
              </Button>
            </form>
          )}
        </Formik>

        <p className="text-sm text-muted-foreground">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};
