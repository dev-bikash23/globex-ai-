import type { PlaceResponse } from '../../types/phase4.types';

interface Props { place: PlaceResponse; }

export function PlaceCard({ place }: Props) {
  return (
    <div className="place-card">
      <div className="place-card__header">
        <span className="place-card__category">{place.category}</span>
        {place.distanceMeters != null && (
          <span className="place-card__distance">
            {place.distanceMeters < 1000
              ? `${Math.round(place.distanceMeters)}m`
              : `${(place.distanceMeters / 1000).toFixed(1)}km`}
          </span>
        )}
      </div>
      <h4 className="place-card__name">{place.name}</h4>
      {place.address && <p className="place-card__address">📍 {place.address}</p>}
      {place.description && <p className="place-card__desc">{place.description}</p>}
      <div className="place-card__meta">
        {place.openingHours && (
          <span className="place-card__hours">🕐 {place.openingHours}</span>
        )}
        {place.website && (
          <a href={place.website} className="place-card__link" target="_blank" rel="noopener noreferrer">
            Website ↗
          </a>
        )}
      </div>
      <span className="place-card__attribution">{place.attribution}</span>
    </div>
  );
}
