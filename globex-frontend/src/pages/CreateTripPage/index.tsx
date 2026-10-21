import { Link } from 'react-router-dom';
import { CreateTripWizard } from '../../features/trips/components/CreateTripWizard';
import Navbar from '../../components/layout/Navbar';

export default function CreateTripPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        {/* ── Sub-header breadcrumb ───────────────────────────────── */}
        <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
          <div className="gx-container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              <Link to="/trips" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>My Trips</Link>
              <span>›</span>
              <span style={{ color: 'var(--color-navy)', fontWeight: 500 }}>New Trip</span>
            </nav>
          </div>
        </div>

        {/* ── Page content ────────────────────────────────────────── */}
        <div className="gx-container" style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: 720 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '2rem' }}>
            Plan a New Trip
          </h1>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
            <CreateTripWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
