import { useState, useEffect } from 'react';
import type { PlaceResponse } from '../types/phase4.types';
import { placesApi } from '../api/placesApi';

export function usePlaces(destinationId: string | undefined, category?: string) {
  const [places, setPlaces] = useState<PlaceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destinationId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    placesApi.getPlaces(destinationId, category, 20)
      .then((data: PlaceResponse[]) => { if (!cancelled) setPlaces(data); })
      .catch(() => { if (!cancelled) setError('Places unavailable'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destinationId, category]);

  return { places, loading, error };
}
