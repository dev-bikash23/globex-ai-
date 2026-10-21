import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Eye, EyeOff } from './icons';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Visual Panel ──────────────────────────────────── */}
      <div className="auth-page__visual">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=1600&fit=crop"
          alt="Beautiful tropical beach"
          className="auth-page__visual-img"
        />
        <div className="auth-page__visual-overlay">
          <h2 className="auth-page__visual-title">
            Your next adventure<br />starts here
          </h2>
          <p className="auth-page__visual-text">
            Discover extraordinary destinations, search real flights, and plan every detail
            of your journey with GlobeX AI.
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ───────────────────────────────────── */}
      <div className="auth-page__form-side">
        <div className="auth-card">
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'linear-gradient(135deg, #245B83, #3C9389)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: '0.95rem',
              }}>
                GX
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-navy)' }}>
                GlobeX <span style={{ color: 'var(--color-teal)' }}>AI</span>
              </span>
            </Link>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--color-navy)',
            marginBottom: '0.25rem',
          }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Sign in to continue planning your journeys.
          </p>

          {error && (
            <div className="alert-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className={`auth-input ${error ? 'error' : ''}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="field-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="password" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Password</span>
                <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.85rem' }}>
                  Forgot password?
                </Link>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`auth-input ${error ? 'error' : ''}`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: 'var(--color-slate-light)',
                    padding: '0.25rem', display: 'flex', alignItems: 'center',
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '1.75rem', width: '100%' }}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} /> Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
