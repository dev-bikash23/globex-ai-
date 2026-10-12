import { useState, useEffect, useCallback } from 'react';
import { listTrips, deleteTrip } from '../api/tripApi';
import type { TripListResponse } from '../types/trip.types';

export function useTrips() {
  const [data, setData] = useState<TripListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await listTrips()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed to load trips'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  const archive = useCallback(async (id: string) => {
    await deleteTrip(id, 'archive');
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, archive };
}
