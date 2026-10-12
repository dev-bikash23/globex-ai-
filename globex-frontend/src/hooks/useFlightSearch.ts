import { useState, useCallback } from 'react';
import { flightApi } from '../api/travelApi';
import type { FlightSearchRequest, FlightSearchResponse } from '../types/phase5.types';

type SearchState = 'idle' | 'loading' | 'success' | 'error';

export function useFlightSearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [response, setResponse] = useState<FlightSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (req: FlightSearchRequest) => {
    setState('loading');
    setError(null);
    try {
      const data = await flightApi.search(req);
      setResponse(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Flight search failed');
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
