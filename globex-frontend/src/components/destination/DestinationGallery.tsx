import { useState } from 'react';
import type { DestinationImageResponse } from '../../types/phase4.types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface Props {
  images: DestinationImageResponse[];
  loading: boolean;
}

export function DestinationGallery({ images, loading }: Props) {
  const [selected, setSelected] = useState<DestinationImageResponse | null>(null);
  const [errored, setErrored] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="dest-gallery dest-gallery--loading">
        <LoadingSkeleton count={1} height="300px" borderRadius="16px" />
      </div>
    );
  }

  if (!images.length) return null;

  return (
    <>
      <div className="dest-gallery">
        {images.slice(0, 3).map((img, idx) => (
          <div
            key={img.id}
            className={`dest-gallery__item dest-gallery__item--${idx}`}
            onClick={() => setSelected(img)}
          >
            {errored.has(img.id) ? (
              <div className="dest-gallery__fallback">🏔️</div>
            ) : (
              <img
                src={img.imageUrl}
                alt={`Destination photo ${idx + 1}`}
                className="dest-gallery__img"
                loading="lazy"
                onError={() => setErrored(prev => new Set([...prev, img.id]))}
              />
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="dest-gallery__lightbox" onClick={() => setSelected(null)}>
          <div className="dest-gallery__lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="dest-gallery__lightbox-close" onClick={() => setSelected(null)}>✕</button>
            <img src={selected.imageUrl} alt="Destination" className="dest-gallery__lightbox-img" />
            <div
              className="dest-gallery__lightbox-attribution"
              dangerouslySetInnerHTML={{ __html: selected.attributionHtml }}
            />
          </div>
        </div>
      )}
    </>
  );
}
