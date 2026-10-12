import { useState } from 'react';
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

import type { DestinationSummary, Destination } from '../../types/destination.types';
import { Link } from 'react-router-dom';

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

    // Load full destination details for preview
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
      {/* ── Navigation bar ────────────────────────────────────────────── */}
      <header className="home-nav">
        <div className="home-nav__brand">
          <span className="home-nav__logo">🌍</span>
          <span className="home-nav__title">GlobeX AI</span>
        </div>
        <div className="home-nav__actions">
          {/* Phase 5: Travel Search */}
          <Link to="/search" className="btn btn-ghost" style={{ color: '#38bdf8', fontWeight: 700 }}>
            ✈️ Search Travel
          </Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* ── Globe canvas ──────────────────────────────────────────────── */}
      <div className="globe-container">
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

      {/* ── Hero overlay ──────────────────────────────────────────────── */}
      <div className="globe-overlay">
        <div className="globe-hero">
          <h1 className="globe-hero__title">Explore the World</h1>
          <p className="globe-hero__sub">Rotate the globe. Click a destination. Begin your journey.</p>
        </div>

        {/* ── Search ──────────────────────────────────────────────────── */}
        <div className="search-container">
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

        {/* ── Loading state ────────────────────────────────────────────── */}
        {markersLoading && (
          <div className="globe-loading">
            <span className="spinner" />
            <span>Loading destinations…</span>
          </div>
        )}
      </div>

      {/* ── Destination preview panel ─────────────────────────────────── */}
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
    </div>
  );
}
