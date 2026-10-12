import type { Destination } from '../../types/destination.types';
import { formatCoords } from '../../utils/coordinates';
import { FavoriteButton } from './FavoriteButton';
import { Link } from 'react-router-dom';

interface Props {
  destination: Destination | null;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  isAuthenticated: boolean;
}

export function DestinationPreview({ destination, onClose, isFavorited, onToggleFavorite, isAuthenticated }: Props) {
  if (!destination) return null;

  return (
    <div className="dest-preview" role="dialog" aria-label={`Preview: ${destination.name}`}>
      <button className="dest-preview__close" onClick={onClose} aria-label="Close preview">✕</button>

      {destination.imageUrl && (
        <div className="dest-preview__image-wrap">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="dest-preview__image"
            loading="lazy"
          />
        </div>
      )}

      <div className="dest-preview__body">
        <div className="dest-preview__flag">
          {destination.country.flagEmoji ?? '📍'}
        </div>
        <h2 className="dest-preview__name">{destination.name}</h2>
        <p className="dest-preview__location">
          {destination.city.name}, {destination.country.name}
        </p>
        <p className="dest-preview__coords">
          {formatCoords(destination.latitude, destination.longitude)}
        </p>
        {destination.description && (
          <p className="dest-preview__desc">{destination.description}</p>
        )}

        <div className="dest-preview__actions">
          <FavoriteButton
            isFavorited={isFavorited}
            onToggle={onToggleFavorite}
            isAuthenticated={isAuthenticated}
          />
          <Link
            to={`/destinations/${destination.slug}`}
            className="btn btn-primary"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
}
