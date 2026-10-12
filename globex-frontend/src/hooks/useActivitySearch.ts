import { useState, useCallback } from 'react';
import { activityApi } from '../api/travelApi';
import type { ActivitySearchRequest, ActivitySearchResponse } from '../types/phase5.types';

type SearchState = 'idle' | 'loading' | 'success' | 'error';

export function useActivitySearch() {
  const [state, setState] = useState<SearchState>('idle');
  const [response, setResponse] = useState<ActivitySearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (req: ActivitySearchRequest) => {
    setState('loading');
    setError(null);
    try {
      const data = await activityApi.search(req);
      setResponse(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activity search failed');
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
