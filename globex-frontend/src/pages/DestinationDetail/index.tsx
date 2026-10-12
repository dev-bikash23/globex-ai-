import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationApi } from '../../api/destinationApi';
import { useFavorites } from '../../features/favorites/useFavorites';
import { useAuth } from '../../auth/AuthProvider';
import { FavoriteButton } from '../../components/destination/FavoriteButton';
import { formatCoords } from '../../utils/coordinates';
import { getMapEmbedUrl, getMapLinkUrl } from '../../utils/mapProvider';
import type { Destination } from '../../types/destination.types';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Phase 4 — live data hooks (only fire when destination is loaded)
  const { weather, loading: weatherLoading } = useWeather(destination?.id);
  const { places, loading: placesLoading, error: placesError } = usePlaces(destination?.id, placeCategory);
  const { images, loading: imagesLoading } = useDestinationImages(destination?.id, 6);
  const { timeInfo, loading: timeLoading } = useLocalTime(destination?.id);

  if (loading) {
    return (
      <div className="detail-page detail-page--loading">
        <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
        <p>Loading destination…</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="detail-page detail-page--error">
        <h2>Destination Not Found</h2>
        <p>{error ?? 'This destination does not exist.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Globe</button>
      </div>
    );
  }

  const mapEmbed = getMapEmbedUrl({ lat: destination.latitude, lng: destination.longitude, zoom: 13 });
  const mapLink  = getMapLinkUrl({ lat: destination.latitude, lng: destination.longitude, zoom: 13 });

  return (
    <div className="detail-page">
      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <header className="detail-nav">
        <Link to="/" className="btn btn-ghost">← Globe</Link>
        <span className="detail-nav__breadcrumb">
          {destination.country.flagEmoji} {destination.country.name} / {destination.city.name}
        </span>
        <FavoriteButton
          isFavorited={isFavorited(destination.id)}
          onToggle={() => toggleFavorite(destination.id)}
          isAuthenticated={isAuthenticated}
        />
      </header>

      {/* ── Hero title (no static image) ─────────────────────────────── */}
      <div className="detail-hero detail-hero--phase4">
        <h1 className="detail-hero__name">{destination.name}</h1>
        <p className="detail-hero__location">
          {destination.country.flagEmoji} {destination.city.name}, {destination.country.name}
        </p>
      </div>

      {/* ── Unsplash Gallery ─────────────────────────────────────────── */}
      <section className="detail-section detail-section--gallery">
        <DestinationGallery images={images} loading={imagesLoading} />
      </section>

      {/* ── Live Data Grid ───────────────────────────────────────────── */}
      <div className="detail-live-grid">
        {/* Weather */}
        <div className="detail-live-card">
          <h3 className="detail-live-card__title">🌤️ Live Weather</h3>
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

      <div className="detail-body">
        <div className="detail-content">
          {/* About */}
          {destination.description && (
            <section className="detail-section">
              <h2 className="detail-section__title">About</h2>
              <p className="detail-section__text">{destination.description}</p>
            </section>
          )}

          {/* Facts */}
          <section className="detail-section">
            <h2 className="detail-section__title">Facts</h2>
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
                <span className="detail-fact__value">{formatCoords(destination.latitude, destination.longitude)}</span>
              </div>
              {timeInfo && (
                <div className="detail-fact">
                  <span className="detail-fact__label">Timezone</span>
                  <span className="detail-fact__value">{timeInfo.timezoneId}</span>
                </div>
              )}
            </div>
          </section>
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

      {/* ── Places / Attractions ─────────────────────────────────────── */}
      <section className="detail-section detail-section--places">
        <PlacesList
          places={places}
          loading={placesLoading}
          error={placesError}
          onCategoryChange={setPlaceCategory}
        />
      </section>

      {/* ── Attribution Footer ───────────────────────────────────────── */}
      <footer className="detail-attribution">
        <span>🌤️ Weather by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a></span>
        <span>💱 Rates by <a href="https://frankfurter.app" target="_blank" rel="noopener noreferrer">Frankfurter</a> / ECB</span>
        <span>📍 <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></span>
        <span>🖼️ Photos by <a href="https://unsplash.com?utm_source=globex_ai&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a></span>
      </footer>
    </div>
  );
}
