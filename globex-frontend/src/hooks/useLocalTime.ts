import { useState, useEffect } from 'react';
import type { LocalTimeInfo } from '../types/phase4.types';
import { timezoneApi } from '../api/placesApi';

export function useLocalTime(destinationId: string | undefined) {
  const [timeInfo, setTimeInfo] = useState<LocalTimeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destinationId) return;
    let cancelled = false;
    setLoading(true);
    timezoneApi.getLocalTime(destinationId)
      .then((data: LocalTimeInfo) => { if (!cancelled) setTimeInfo(data); })
      .catch(() => { if (!cancelled) setError('Time unavailable'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destinationId]);

  return { timeInfo, loading, error };
}
