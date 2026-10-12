import { formatCoords } from '../../utils/coordinates';
import type { DestinationSummary } from '../../types/destination.types';

interface Props {
  results: DestinationSummary[];
  query: string;
  onSelect: (d: DestinationSummary) => void;
  visible: boolean;
}

export function SearchResults({ results, query, onSelect, visible }: Props) {
  if (!visible || !query.trim()) return null;

  return (
    <div className="search-results" role="listbox" aria-label="Search results">
      {results.length === 0 ? (
        <div className="search-results__empty">No results for "{query}"</div>
      ) : (
        results.map(r => (
          <button
            key={r.id}
            className="search-results__item"
            onClick={() => onSelect(r)}
            role="option"
            aria-selected={false}
          >
            <span className="search-results__flag">{r.flagEmoji ?? '📍'}</span>
            <div className="search-results__info">
              <span className="search-results__name">{r.name}</span>
              <span className="search-results__meta">
                {r.countryName} · {formatCoords(r.latitude, r.longitude)}
              </span>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
