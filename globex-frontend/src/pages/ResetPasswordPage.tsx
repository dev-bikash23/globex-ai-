import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../auth/authService';
import { Eye, EyeOff } from './icons';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

export default function ResetPasswordPage() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const token      = params.get('token') || '';

  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD_REGEX.test(password)) {
      setPassError('Password must be ≥8 chars with uppercase, lowercase, digit & special char');
      return;
    }
    setPassError(null);
    setApiError(null);
    setLoading(true);
    try {
      const result = await authService.resetPassword(token, password);
      if (result.success) setSuccess(true);
      else setApiError(result.error?.message || 'Reset failed. Please try again.');
    } catch {
      setApiError('An error occurred. Please request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-danger)' }}>Invalid reset link. Please request a new one.</p>
          <Link to="/forgot-password" className="auth-link" style={{ display: 'block', marginTop: '1rem' }}>
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Password reset!</h2>
          <p style={{ color: 'var(--color-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Your password has been changed and all sessions have been revoked for security.
          </p>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/login')}>
            Sign in with new password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: '100%', maxWidth: '440px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Set new password</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Choose a strong password for your GlobeX AI account.
        </p>
        {apiError && <div className="alert-error" role="alert">⚠ {apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="new-password">New password</label>
            <div style={{ position: 'relative' }}>
              <input id="new-password" type={showPass ? 'text' : 'password'}
                className={`auth-input ${passError ? 'error' : ''}`}
                value={password} onChange={e => { setPassword(e.target.value); setPassError(null); }}
                placeholder="Min 8 chars, upper, lower, digit, symbol"
                autoComplete="new-password" disabled={loading} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}
                aria-label="Toggle password">
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {passError && <p className="field-error">{passError}</p>}
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}
            disabled={loading || !password}>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
