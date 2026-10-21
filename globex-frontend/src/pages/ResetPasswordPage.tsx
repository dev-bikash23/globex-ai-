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

  const FormWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="auth-page">
      <div className="auth-page__visual">
        <img src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&h=1600&fit=crop"
          alt="Secure travel" className="auth-page__visual-img" />
        <div className="auth-page__visual-overlay">
          <h2 className="auth-page__visual-title">Almost there —<br />set your new password</h2>
          <p className="auth-page__visual-text">Choose a strong, unique password to keep your account secure.</p>
        </div>
      </div>
      <div className="auth-page__form-side">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );

  if (!token) {
    return (
      <FormWrapper>
        <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>Invalid reset link. Please request a new one.</p>
        <Link to="/forgot-password" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
          Request new link
        </Link>
      </FormWrapper>
    );
  }

  if (success) {
    return (
      <FormWrapper>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)' }}>Password reset!</h2>
          <p style={{ color: 'var(--color-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Your password has been changed and all sessions have been revoked for security.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }} onClick={() => navigate('/login')}>
            Sign in with new password
          </button>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #245B83, #3C9389)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>GX</div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-navy)' }}>GlobeX <span style={{ color: 'var(--color-teal)' }}>AI</span></span>
        </Link>
      </div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
        Set new password
      </h2>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
        Choose a strong password for your GlobeX AI account.
      </p>
      {apiError && <div className="alert-error" role="alert">{apiError}</div>}
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
              style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-light)', display: 'flex' }}
              aria-label="Toggle password">
              {showPass ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {passError && <p className="field-error">{passError}</p>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.75rem', width: '100%' }}
          disabled={loading || !password}>
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </FormWrapper>
  );
}
