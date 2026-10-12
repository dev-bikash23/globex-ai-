import { useState } from 'react';
import type { PlaceResponse } from '../../types/phase4.types';
import { PlaceCard } from './PlaceCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface Props {
  places: PlaceResponse[];
  loading: boolean;
  error: string | null;
  onCategoryChange?: (category: string | undefined) => void;
}

const CATEGORIES = [
  { value: undefined, label: 'All' },
  { value: 'tourism', label: '🏛️ Attractions' },
  { value: 'museum', label: '🎨 Museums' },
  { value: 'park', label: '🌿 Parks' },
  { value: 'historic', label: '🏰 Historic' },
  { value: 'food', label: '🍽️ Food' },
];

export function PlacesList({ places, loading, error, onCategoryChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const handleCategory = (cat: string | undefined) => {
    setActiveCategory(cat);
    onCategoryChange?.(cat);
  };

  return (
    <div className="places-list">
      <div className="places-list__header">
        <h3 className="places-list__title">📍 Popular Places</h3>
        <div className="places-list__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className={`places-list__filter ${activeCategory === cat.value ? 'places-list__filter--active' : ''}`}
              onClick={() => handleCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="places-list__loading">
          <LoadingSkeleton count={3} height="120px" />
        </div>
      )}

      {error && <p className="places-list__error">⚠️ {error}</p>}

      {!loading && !error && places.length === 0 && (
        <p className="places-list__empty">No places found in this category. Try another filter.</p>
      )}

      {!loading && places.length > 0 && (
        <div className="places-list__grid">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
