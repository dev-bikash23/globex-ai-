import { useState, useEffect } from 'react';
import type { WeatherResponse } from '../types/phase4.types';
import { weatherApi } from '../api/weatherApi';

export function useWeather(destinationId: string | undefined) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destinationId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    weatherApi.getWeather(destinationId)
      .then((data: WeatherResponse) => { if (!cancelled) setWeather(data); })
      .catch(() => { if (!cancelled) setError('Weather unavailable'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destinationId]);

  return { weather, loading, error };
}
