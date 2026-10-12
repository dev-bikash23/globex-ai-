import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../auth/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Check your email</h2>
          <p style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
            If an account with <strong style={{ color: 'var(--color-text)' }}>{email}</strong> exists,
            a password reset link has been sent.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'block', marginTop: '2rem', textDecoration: 'none', textAlign: 'center' }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="globe-icon">🌍</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.75rem' }}>
            GlobeX <span style={{ color: 'var(--color-accent)' }}>AI</span>
          </h1>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Reset your password</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Enter the email associated with your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="forgot-email">Email address</label>
            <input id="forgot-email" type="email" className="auth-input"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required disabled={loading} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}
            disabled={loading || !email}>
            {loading
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner" /> Sending…</span>
              : 'Send reset link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          Remembered it?{' '}<Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
