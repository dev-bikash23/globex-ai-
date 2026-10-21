import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationApi } from '../../api/destinationApi';
import { useFavorites } from '../../features/favorites/useFavorites';
import { useAuth } from '../../auth/AuthProvider';
import { FavoriteButton } from '../../components/destination/FavoriteButton';
import { formatCoords } from '../../utils/coordinates';
import { getMapEmbedUrl, getMapLinkUrl } from '../../utils/mapProvider';
import type { Destination } from '../../types/destination.types';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Phase 4 — hooks
import { useWeather } from '../../hooks/useWeather';
import { usePlaces } from '../../hooks/usePlaces';
import { useDestinationImages } from '../../hooks/useDestinationImages';
import { useLocalTime } from '../../hooks/useLocalTime';

// Phase 4 — components
import { WeatherCard } from '../../components/weather/WeatherCard';
import { WeatherForecast } from '../../components/weather/WeatherForecast';
import { CurrencyConverter } from '../../components/currency/CurrencyConverter';
import { PlacesList } from '../../components/places/PlacesList';
import { DestinationGallery } from '../../components/destination/DestinationGallery';
import { LocalTimeClock } from '../../components/common/LocalTimeClock';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const isAuthenticated = authState.status === 'authenticated';
  const { isFavorited, toggleFavorite } = useFavorites();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [placeCategory, setPlaceCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    destinationApi.getBySlug(slug)
      .then(d => { if (!cancelled) setDestination(d); })
      .catch(() => { if (!cancelled) setError('Destination not found.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const { weather, loading: weatherLoading } = useWeather(destination?.id);
  const { places, loading: placesLoading, error: placesError } = usePlaces(destination?.id, placeCategory);
  const { images, loading: imagesLoading } = useDestinationImages(destination?.id, 6);
  const { timeInfo, loading: timeLoading } = useLocalTime(destination?.id);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
        <Navbar variant="solid" />
        <div className="detail-page--loading" style={{ paddingTop: 'var(--nav-height)' }}>
          <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
          <p style={{ color: 'var(--color-muted)' }}>Loading destination…</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
        <Navbar variant="solid" />
        <div className="detail-page--error" style={{ paddingTop: 'var(--nav-height)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-navy)' }}>Destination Not Found</h2>
          <p style={{ color: 'var(--color-muted)' }}>{error ?? 'This destination does not exist.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Globe</button>
        </div>
      </div>
    );
  }

  const mapEmbed = getMapEmbedUrl({ lat: destination.latitude, lng: destination.longitude, zoom: 13 });
  const mapLink  = getMapLinkUrl({ lat: destination.latitude, lng: destination.longitude, zoom: 13 });

  return (
    <div className="detail-page">
      <Navbar variant="solid" />

      {/* spacing for fixed nav */}
      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <section style={{
          background: `linear-gradient(135deg, var(--color-navy) 0%, var(--color-ocean) 100%)`,
          padding: '3rem 0 2.5rem',
          color: '#fff',
        }}>
          <div className="gx-container">
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <span>{destination.country.flagEmoji} {destination.country.name}</span>
              <span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>{destination.name}</span>
            </nav>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '0.5rem' }}>
                  {destination.name}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                  {destination.country.flagEmoji} {destination.city.name}, {destination.country.name}
                </p>
              </div>
              <FavoriteButton
                isFavorited={isFavorited(destination.id)}
                onToggle={() => toggleFavorite(destination.id)}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </section>

        {/* ── Photo Gallery ─────────────────────────────────────────── */}
        <section style={{ background: 'var(--color-ivory)', padding: '2rem 0' }}>
          <DestinationGallery images={images} loading={imagesLoading} />
        </section>

        {/* ── Live Data Cards ───────────────────────────────────────── */}
        <section style={{ background: 'var(--color-ivory)', padding: '0 0 2rem' }}>
          <div className="detail-live-grid">
            {/* Weather */}
            <div className="detail-live-card">
              <h3 className="detail-live-card__title">🌤 Live Weather</h3>
              {weatherLoading ? (
                <LoadingSkeleton count={1} height="180px" />
              ) : weather ? (
                <>
                  <WeatherCard weather={weather} />
                  <WeatherForecast weather={weather} />
                </>
              ) : (
                <p className="detail-live-card__unavailable">Weather unavailable</p>
              )}
            </div>

            {/* Local Time */}
            <div className="detail-live-card">
              <h3 className="detail-live-card__title">🕐 Local Time</h3>
              {timeLoading ? (
                <LoadingSkeleton count={1} height="120px" />
              ) : (
                <LocalTimeClock timeInfo={timeInfo} loading={timeLoading} />
              )}
            </div>

            {/* Currency */}
            <div className="detail-live-card">
              <CurrencyConverter defaultTarget={destination.country.currencyCode ?? 'EUR'} />
            </div>
          </div>
        </section>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <section style={{ background: 'var(--color-ivory)', padding: '0 0 3rem' }}>
          <div className="detail-body">
            <div className="detail-content">
              {/* About */}
              {destination.description && (
                <div className="detail-section">
                  <h2 className="detail-section__title">About</h2>
                  <p className="detail-section__text">{destination.description}</p>
                </div>
              )}

              {/* Facts */}
              <div className="detail-section">
                <h2 className="detail-section__title">Quick Facts</h2>
                <div className="detail-facts">
                  <div className="detail-fact">
                    <span className="detail-fact__label">Country</span>
                    <span className="detail-fact__value">{destination.country.flagEmoji} {destination.country.name}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-fact__label">City</span>
                    <span className="detail-fact__value">{destination.city.name}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-fact__label">Continent</span>
                    <span className="detail-fact__value">{destination.country.continent}</span>
                  </div>
                  {destination.country.currencyCode && (
                    <div className="detail-fact">
                      <span className="detail-fact__label">Currency</span>
                      <span className="detail-fact__value">{destination.country.currencyCode}</span>
                    </div>
                  )}
                  {destination.country.primaryLanguage && (
                    <div className="detail-fact">
                      <span className="detail-fact__label">Language</span>
                      <span className="detail-fact__value">{destination.country.primaryLanguage}</span>
                    </div>
                  )}
                  <div className="detail-fact">
                    <span className="detail-fact__label">Coordinates</span>
                    <span className="detail-fact__value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {formatCoords(destination.latitude, destination.longitude)}
                    </span>
                  </div>
                  {timeInfo && (
                    <div className="detail-fact">
                      <span className="detail-fact__label">Timezone</span>
                      <span className="detail-fact__value">{timeInfo.timezoneId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Search flights CTA */}
              <div style={{ background: 'rgba(36, 91, 131, 0.05)', border: '1px solid rgba(36, 91, 131, 0.12)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginTop: '1.5rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                  ✈️ Ready to visit {destination.city.name}?
                </p>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Search real flights and hotels for your trip.
                </p>
                <Link to="/search" className="btn btn-secondary btn-sm">
                  Search Flights & Hotels →
                </Link>
              </div>
            </div>

            {/* Map */}
            <div className="detail-map-wrap">
              <h2 className="detail-section__title">Map</h2>
              <iframe
                className="detail-map"
                src={mapEmbed}
                title={`Map of ${destination.name}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <a href={mapLink} className="detail-map-link" target="_blank" rel="noopener noreferrer">
                Open in OpenStreetMap ↗
              </a>
            </div>
          </div>
        </section>

        {/* ── Places / Attractions ──────────────────────────────────── */}
        <section style={{ background: 'var(--color-surface)', padding: '3rem 0', borderTop: '1px solid var(--color-border)' }}>
          <PlacesList places={places} loading={placesLoading} error={placesError} onCategoryChange={setPlaceCategory} />
        </section>

        {/* ── Attribution Footer ────────────────────────────────────── */}
        <div className="detail-attribution">
          <span>🌤 Weather by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a></span>
          <span>💱 Rates by <a href="https://frankfurter.app" target="_blank" rel="noopener noreferrer">Frankfurter</a> / ECB</span>
          <span>📍 <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></span>
          <span>🖼 Photos by <a href="https://unsplash.com?utm_source=globex_ai&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a></span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
