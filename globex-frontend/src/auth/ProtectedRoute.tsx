import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Unauthenticated users are redirected to /login.
 * Shows a loading spinner while the auth state is being resolved.
 */
export default function ProtectedRoute() {
  const { state } = useAuth();

  if (state.status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
          <p style={{ color: 'var(--color-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>
            Restoring session…
          </p>
        </div>
      </div>
    );
  }

  if (state.status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
