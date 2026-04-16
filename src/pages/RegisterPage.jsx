import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Card } from '../components/ui/card.jsx';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register({ email, password, name });
      if (res?.message) toast.success(res.message);
      navigate('/', { replace: true });
    } catch (err) {
      const msg =
        err?.api?.message || err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h1>Create your account</h1>
        <p className="muted">Standard accounts can join meetings created by admins.</p>
        <form onSubmit={onSubmit} className="form">
          {error ? <div className="alert alert-error">{error}</div> : null}
          <Label>
            Name
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Label>
          <Label>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Label>
          <Label>
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </Label>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>
        <p className="muted small">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
