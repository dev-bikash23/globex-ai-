import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../auth/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

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
        <div className="auth-page__form-side">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              Check your email
            </h2>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
              If an account with <strong style={{ color: 'var(--color-navy)' }}>{email}</strong> exists,
              a password reset link has been sent.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'flex', marginTop: '2rem', textDecoration: 'none', justifyContent: 'center' }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=1600&fit=crop"
          alt="Mountain path"
          className="auth-page__visual-img"
        />
        <div className="auth-page__visual-overlay">
          <h2 className="auth-page__visual-title">Lost your way?<br />We'll help you back</h2>
          <p className="auth-page__visual-text">
            Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #245B83, #3C9389)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>GX</div>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-navy)' }}>GlobeX <span style={{ color: 'var(--color-teal)' }}>AI</span></span>
            </Link>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
            Reset your password
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Enter the email associated with your account.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="forgot-email">Email address</label>
              <input id="forgot-email" type="email" className="auth-input"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required disabled={loading} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.75rem', width: '100%' }}
              disabled={loading || !email}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} /> Sending…</span>
                : 'Send reset link'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Remembered it?{' '}<Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
