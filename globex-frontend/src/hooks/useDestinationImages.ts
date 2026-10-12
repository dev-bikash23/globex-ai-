import { useState, useEffect } from 'react';
import type { DestinationImageResponse } from '../types/phase4.types';
import { imagesApi } from '../api/imagesApi';

export function useDestinationImages(destinationId: string | undefined, count = 6) {
  const [images, setImages] = useState<DestinationImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destinationId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    imagesApi.getImages(destinationId, count)
      .then((data: DestinationImageResponse[]) => { if (!cancelled) setImages(data); })
      .catch(() => { if (!cancelled) setError('Images unavailable'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destinationId, count]);

  return { images, loading, error };
}
