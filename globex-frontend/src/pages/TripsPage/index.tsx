import { Link } from 'react-router-dom';
import { useTrips } from '../../features/trips/hooks/useTrips';
import { TripCard } from '../../features/trips/components/TripCard';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const sectionHeading: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--color-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '1rem',
};

export default function TripsPage() {
  const { data, loading, error, archive } = useTrips();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* ── Page Hero ──────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-ocean) 100%)', padding: '3rem 0 2.5rem', color: '#fff' }}>
          <div className="gx-container">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Travel Plans</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, marginBottom: '0.25rem' }}>My Trips</h1>
                {!loading && !error && (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem' }}>
                    {data?.totalCount ?? 0} trip{data?.totalCount !== 1 ? 's' : ''} total
                  </p>
                )}
              </div>
              <Link to="/trips/new" className="btn btn-primary">
                + Plan a New Trip
              </Link>
            </div>
          </div>
        </section>

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="gx-container" style={{ padding: '2.5rem 1.5rem 4rem' }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
              <p style={{ color: 'var(--color-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Loading your trips…</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}

          {!loading && !error && (() => {
            const upcoming = data?.upcoming ?? [];
            const planning = data?.planning ?? [];
            const past     = data?.past ?? [];
            const hasTrips = upcoming.length + planning.length + past.length > 0;

            if (!hasTrips) {
              return (
                <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🗺️</div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                    No trips yet
                  </h2>
                  <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Create your first trip to start building your travel itinerary.
                  </p>
                  <Link to="/trips/new" className="btn btn-primary btn-lg">
                    Plan Your First Trip
                  </Link>
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {upcoming.length > 0 && (
                  <section>
                    <h2 style={sectionHeading}>Upcoming</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                      {upcoming.map(t => <TripCard key={t.id} trip={t} onArchive={archive} />)}
                    </div>
                  </section>
                )}

                {planning.length > 0 && (
                  <section>
                    <h2 style={sectionHeading}>Planning</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                      {planning.map(t => <TripCard key={t.id} trip={t} onArchive={archive} />)}
                    </div>
                  </section>
                )}

                {past.length > 0 && (
                  <section>
                    <h2 style={sectionHeading}>Past Trips</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                      {past.map(t => <TripCard key={t.id} trip={t} />)}
                    </div>
                  </section>
                )}
              </div>
            );
          })()}
        </div>
      </div>
      <Footer />
    </div>
  );
}
