import { useAuth } from '../auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function DashboardPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const user = state.status === 'authenticated' ? state.user : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const quickActions = [
    { icon: '✈️', label: 'Search Flights', desc: 'Find real-time flight offers', to: '/search', color: '#245B83' },
    { icon: '🏨', label: 'Find Hotels',    desc: 'Discover places to stay',    to: '/search', color: '#3C9389' },
    { icon: '📋', label: 'My Trips',       desc: 'View & manage your trips',   to: '/trips',  color: '#C8A951' },
    { icon: '+ Trip', label: 'Plan a Trip', desc: 'Create a new itinerary',    to: '/trips/new', color: '#687584' },
  ];

  const features = [
    { icon: '🌍', title: '3D Globe Explorer', desc: 'Interactive globe with destination markers', status: 'Live', ok: true },
    { icon: '🔐', title: 'Secure Auth',        desc: 'JWT + Refresh Token Rotation',              status: 'Live', ok: true },
    { icon: '✈️', title: 'Flight Search',      desc: 'Duffel API real-time flight offers',        status: 'Live', ok: true },
    { icon: '🏨', title: 'Hotel Discovery',    desc: 'Live hotel availability & pricing',         status: 'Live', ok: true },
    { icon: '🌤️', title: 'Live Weather',       desc: 'Open-Meteo per-destination forecasts',      status: 'Live', ok: true },
    { icon: '💱', title: 'Currency Rates',     desc: 'ECB/Frankfurter exchange rates',            status: 'Live', ok: true },
    { icon: '📋', title: 'Trip Planner',       desc: 'Day-by-day itinerary & budget tracking',   status: 'Live', ok: true },
    { icon: '❤️', title: 'Favorites',          desc: 'Save and revisit destinations',             status: 'Live', ok: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />

      {/* Page top padding to account for fixed nav */}
      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* ── Hero welcome banner ─────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-ocean) 100%)',
          padding: '3rem 0 3.5rem',
          color: '#fff',
        }}>
          <div className="gx-container">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Dashboard
                </p>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Welcome back, {user?.firstName || 'Traveler'} 👋
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                  {user?.email}
                  {!user?.emailVerified && (
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', background: 'rgba(212,160,23,0.2)', color: '#fcd34d', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>
                      Email unverified
                    </span>
                  )}
                </p>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', alignSelf: 'flex-start' }}>
                Sign out
              </button>
            </div>
          </div>
        </section>

        <div className="gx-container" style={{ padding: '0 1.5rem' }}>
          {/* ── Quick actions ──────────────────────────────────── */}
          <section style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {quickActions.map(action => (
                <Link key={action.label} to={action.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: action.icon.length > 2 ? '0.8rem' : '1.4rem', color: action.color, fontWeight: 700, flexShrink: 0 }}>
                      {action.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9375rem', lineHeight: 1.2 }}>{action.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>{action.desc}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Feature status grid ────────────────────────────── */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
              Platform Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {features.map(feat => (
                <div key={feat.title} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{feat.icon}</span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      background: feat.ok ? 'rgba(45,143,94,0.1)' : 'rgba(104,117,132,0.1)',
                      color: feat.ok ? 'var(--color-success)' : 'var(--color-muted)',
                      padding: '0.2rem 0.6rem', borderRadius: '9999px',
                    }}>
                      {feat.status}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
