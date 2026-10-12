import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard placeholder — Phase 2 foundation.
 * Full 3D Earth + destination features added in Phase 3.
 */
export default function DashboardPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const user = state.status === 'authenticated' ? state.user : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '2rem' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: '1200px', margin: '0 auto 2rem',
        paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🌍</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            GlobeX <span style={{ color: 'var(--color-accent)' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user && (
            <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              {user.firstName} {user.lastName}
              {!user.emailVerified && (
                <span style={{
                  marginLeft: '0.5rem', fontSize: '0.75rem',
                  background: 'rgba(245,158,11,0.15)', color: 'var(--color-gold)',
                  padding: '0.2rem 0.5rem', borderRadius: '9999px'
                }}>
                  Unverified
                </span>
              )}
            </span>
          )}
          <button onClick={handleLogout} style={{
            background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem',
            padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem',
            fontWeight: 500, transition: 'background 0.2s'
          }}>
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
            Welcome back, {user?.firstName} 👋
          </h1>
          <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>
            Phase 2 Authentication Complete — Your account is secured.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '🔐', title: 'Authentication', desc: 'JWT + Refresh Token Rotation', status: '✅ Live' },
            { icon: '🛡️', title: 'Security', desc: 'BCrypt, Account Locking, Audit Logs', status: '✅ Live' },
            { icon: '📧', title: 'Email Verification', desc: 'Secure token-based verification', status: '✅ Live' },
            { icon: '🔑', title: 'Password Reset', desc: 'Single-use expiring reset tokens', status: '✅ Live' },
            { icon: '👤', title: 'RBAC', desc: 'USER and ADMIN roles enforced', status: '✅ Live' },
            { icon: '🌍', title: '3D Earth Explorer', desc: 'Interactive globe + destinations', status: '🔜 Phase 3' },
          ].map(card => (
            <div key={card.title} className="auth-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{card.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                {card.desc}
              </p>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600,
                color: card.status.startsWith('✅') ? 'var(--color-success)' : 'var(--color-muted)'
              }}>
                {card.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
