import { useState, useEffect } from 'react';
import { destinationApi } from '../../api/destinationApi';
import type { DestinationSummary } from '../../types/destination.types';

export function useFeaturedDestinations() {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    destinationApi.getFeatured()
      .then(data => { if (!cancelled) setDestinations(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { destinations, loading, error };
}
