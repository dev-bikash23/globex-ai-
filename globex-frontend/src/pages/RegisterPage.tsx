import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Eye, EyeOff } from './icons';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2) errors.firstName = 'First name must be at least 2 characters';
    if (!form.lastName.trim() || form.lastName.trim().length < 2)   errors.lastName  = 'Last name must be at least 2 characters';
    if (!form.email.includes('@'))       errors.email    = 'Enter a valid email address';
    if (!PASSWORD_REGEX.test(form.password)) {
      errors.password = 'Password must be ≥8 chars with uppercase, lowercase, digit & special char';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(null);
    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-page__form-side">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--color-navy)',
              marginBottom: '0.75rem',
            }}>
              Check your inbox!
            </h2>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
              We sent a verification link to <strong style={{ color: 'var(--color-navy)' }}>{form.email}</strong>.
              Please verify your email before logging in.
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '2rem', width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* ── Left Visual Panel ──────────────────────────────────── */}
      <div className="auth-page__visual">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=1600&fit=crop"
          alt="Mountain lake landscape"
          className="auth-page__visual-img"
        />
        <div className="auth-page__visual-overlay">
          <h2 className="auth-page__visual-title">
            Begin your<br />journey today
          </h2>
          <p className="auth-page__visual-text">
            Join thousands of travelers who plan their adventures with GlobeX AI's interactive
            3D globe and intelligent trip planning.
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ───────────────────────────────────── */}
      <div className="auth-page__form-side">
        <div className="auth-card" style={{ maxWidth: '480px' }}>
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
            Create your account
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Start your journey today — it's free.
          </p>

          {apiError && <div className="alert-error" role="alert">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="field-group">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" type="text" className={`auth-input ${fieldErrors.firstName ? 'error' : ''}`}
                  value={form.firstName} onChange={update('firstName')} placeholder="Bikas" disabled={loading} />
                {fieldErrors.firstName && <p className="field-error">{fieldErrors.firstName}</p>}
              </div>
              <div className="field-group">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" type="text" className={`auth-input ${fieldErrors.lastName ? 'error' : ''}`}
                  value={form.lastName} onChange={update('lastName')} placeholder="Kumar" disabled={loading} />
                {fieldErrors.lastName && <p className="field-error">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="reg-email">Email address</label>
              <input id="reg-email" type="email" className={`auth-input ${fieldErrors.email ? 'error' : ''}`}
                value={form.email} onChange={update('email')} placeholder="you@example.com"
                autoComplete="email" disabled={loading} />
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>

            <div className="field-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" type={showPass ? 'text' : 'password'}
                  className={`auth-input ${fieldErrors.password ? 'error' : ''}`}
                  value={form.password} onChange={update('password')}
                  placeholder="Min 8 chars, upper, lower, digit, symbol"
                  autoComplete="new-password" disabled={loading} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-light)',
                    display: 'flex', alignItems: 'center' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.75rem', width: '100%' }}
              disabled={loading || !form.firstName || !form.lastName || !form.email || !form.password}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} /> Creating account…</span>
                : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}<Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
