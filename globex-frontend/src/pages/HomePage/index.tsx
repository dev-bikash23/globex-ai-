import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWebGL } from '../../hooks/useWebGL';
import { useGlobeCamera } from '../../hooks/useGlobeCamera';
import { useFeaturedDestinations } from '../../features/destinations/useDestinations';
import { useDestinationSearch } from '../../features/destinations/useDestinationSearch';
import { useFavorites } from '../../features/favorites/useFavorites';
import { useAuth } from '../../auth/AuthProvider';
import { destinationApi } from '../../api/destinationApi';

import { GlobeScene } from '../../components/globe/GlobeScene';
import { WebGLFallback } from '../../components/common/WebGLFallback';
import { SearchBar } from '../../components/search/SearchBar';
import { SearchResults } from '../../components/search/SearchResults';
import { DestinationPreview } from '../../components/destination/DestinationPreview';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import type { DestinationSummary, Destination } from '../../types/destination.types';

/* ── Curated destination images (Unsplash) ──────────────────────── */
const HERO_DESTINATIONS = [
  {
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=450&fit=crop',
    slug: 'santorini-caldera',
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=450&fit=crop',
    slug: 'shibuya-crossing',
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=450&fit=crop',
    slug: 'machu-picchu',
  },
  {
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=450&fit=crop',
    slug: 'eiffel-tower',
  },
  {
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=450&fit=crop',
    slug: 'burj-khalifa',
  },
  {
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=450&fit=crop',
    slug: 'colosseum',
  },
];

const TRAVEL_STATS = [
  { value: '10+', label: 'Destinations' },
  { value: '150+', label: 'Countries' },
  { value: '24/7', label: 'Live Data' },
  { value: '3D', label: 'Globe Explorer' },
];

export default function HomePage() {
  const webglSupported = useWebGL();
  const { state: authState } = useAuth();
  const isAuthenticated = authState.status === 'authenticated';

  const { destinations, loading: markersLoading } = useFeaturedDestinations();
  const { query, setQuery, results, loading: searchLoading, clear } = useDestinationSearch();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { target, focusOn } = useGlobeCamera();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewDestination, setPreviewDestination] = useState<Destination | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const showResults = query.trim().length >= 2;

  async function handleSelectDestination(summary: DestinationSummary) {
    setSelectedId(summary.id);
    focusOn(summary.latitude, summary.longitude, summary.name);
    clear();

    setPreviewLoading(true);
    try {
      const full = await destinationApi.getById(summary.id);
      setPreviewDestination(full);
    } catch {
      // Fail gracefully — marker still highlighted on globe
    } finally {
      setPreviewLoading(false);
    }
  }

  function handleClosePreview() {
    setPreviewDestination(null);
    setSelectedId(null);
  }

  return (
    <div className="home-page">
      {/* ── Navbar (transparent over hero) ───────────────────────── */}
      <Navbar variant="transparent" />

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION — Cinematic globe with editorial overlay
          ══════════════════════════════════════════════════════════════ */}
      <section className="home-hero">
        {/* Globe Background */}
        <div className="home-hero__bg">
          {webglSupported ? (
            <GlobeScene
              destinations={destinations}
              selectedId={selectedId}
              cameraTarget={target}
              onSelectDestination={handleSelectDestination}
            />
          ) : (
            <WebGLFallback />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="home-hero__overlay" />

        {/* Hero Content */}
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Premium Travel Discovery</p>
          <h1 className="home-hero__title">
            The world,<br /><em>thoughtfully explored</em>
          </h1>
          <p className="home-hero__subtitle">
            Discover extraordinary destinations on an interactive 3D globe. Search flights, hotels,
            and plan every detail of your journey.
          </p>

          {/* Search */}
          <div className="home-hero__search">
            <SearchBar
              value={query}
              onChange={setQuery}
              onClear={clear}
              loading={searchLoading}
            />
            <SearchResults
              results={results}
              query={query}
              onSelect={handleSelectDestination}
              visible={showResults}
            />
          </div>

          {/* Quick action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/search"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'rgba(255,255,255,0.25)',
                color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
            >
              ✈️ Search Flights
            </Link>
            {isAuthenticated && (
              <Link
                to="/trips/new"
                className="btn btn-primary btn-sm"
              >
                + Plan a Trip
              </Link>
            )}
          </div>

          {/* Loading indicator */}
          {markersLoading && (
            <div className="globe-loading">
              <span className="spinner spinner-dark" style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>Loading destinations…</span>
            </div>
          )}
        </div>

        {/* Destination preview panel */}
        {previewLoading && (
          <div className="dest-preview dest-preview--loading">
            <span className="spinner" />
          </div>
        )}
        {!previewLoading && previewDestination && (
          <DestinationPreview
            destination={previewDestination}
            onClose={handleClosePreview}
            isFavorited={isFavorited(previewDestination.id)}
            onToggleFavorite={() => toggleFavorite(previewDestination.id)}
            isAuthenticated={isAuthenticated}
          />
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRAVEL STATS BAR
          ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '2.5rem 0',
      }}>
        <div className="gx-container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
        }}>
          {TRAVEL_STATS.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--color-navy)',
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--color-muted)',
                marginTop: '0.35rem',
                letterSpacing: '0.03em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED DESTINATIONS
          ══════════════════════════════════════════════════════════════ */}
      <section className="home-featured">
        <div className="gx-container">
          <div className="section-heading">
            <p className="section-heading__eyebrow">Featured Destinations</p>
            <h2 className="section-heading__title">Where will your next journey take you?</h2>
            <p className="section-heading__subtitle">
              Explore our curated selection of extraordinary destinations around the world.
            </p>
          </div>

          <div className="home-featured__grid">
            {HERO_DESTINATIONS.map((dest, i) => (
              <Link to={`/destinations/${dest.slug}`} key={i} style={{ textDecoration: 'none' }}>
                <div className="dest-card">
                  <img
                    className="dest-card__img"
                    src={dest.image}
                    alt={dest.name}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="dest-card__overlay" />
                  <div className="dest-card__content">
                    <div className="dest-card__name">{dest.name}</div>
                    <div className="dest-card__location">{dest.country}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/search" className="btn btn-outline">
              Explore All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', background: 'var(--color-surface)' }}>
        <div className="gx-container">
          <div className="section-heading">
            <p className="section-heading__eyebrow">How It Works</p>
            <h2 className="section-heading__title">Plan your perfect trip</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {[
              { step: '01', icon: '🌍', title: 'Explore', desc: 'Spin the 3D globe and discover destinations around the world.' },
              { step: '02', icon: '✈️', title: 'Search', desc: 'Find real flights, hotels, and activities with live pricing.' },
              { step: '03', icon: '📋', title: 'Plan', desc: 'Build day-by-day itineraries, track budgets, and manage travelers.' },
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 'var(--radius-lg)',
                  background: 'rgba(60, 147, 137, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem', margin: '0 auto 1rem',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)',
                  letterSpacing: '0.1em', marginBottom: '0.5rem',
                }}>
                  STEP {item.step}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-navy)',
                  marginBottom: '0.5rem',
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '5rem 0',
        background: 'var(--color-navy)',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div className="gx-container">
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            Ready to explore the world?
          </h2>
          <p style={{
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '480px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}>
            Create your free account and start planning your next adventure with GlobeX AI.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/trips/new" className="btn btn-primary btn-lg">
                + Plan a New Trip
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
