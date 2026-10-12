import { useState, useCallback } from 'react';
import { hotelApi } from '../api/travelApi';
import type { HotelSearchRequest, HotelSearchResponse } from '../types/phase5.types';

type SearchState = 'idle' | 'loading' | 'success' | 'error';

export function useHotelSearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [response, setResponse] = useState<HotelSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (req: HotelSearchRequest) => {
    setState('loading');
    setError(null);
    try {
      const data = await hotelApi.search(req);
      setResponse(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hotel search failed');
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setResponse(null);
    setError(null);
  }, []);

  return { state, response, error, search, reset, isLoading: state === 'loading' };
}
