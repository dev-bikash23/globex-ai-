import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/tripApi';
import type { ItineraryResponse, CreateItineraryDayRequest, CreateItineraryItemRequest, ItineraryItem } from '../types/trip.types';

export function useItinerary(tripId: string) {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try { setItinerary(await api.getItinerary(tripId)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed to load itinerary'); }
    finally { setLoading(false); }
  }, [tripId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const addDay = useCallback(async (req: CreateItineraryDayRequest) => {
    await api.createDay(tripId, req); void refresh();
  }, [tripId, refresh]);

  const removeDay = useCallback(async (dayId: string) => {
    await api.deleteDay(tripId, dayId); void refresh();
  }, [tripId, refresh]);

  const addItem = useCallback(async (dayId: string, req: CreateItineraryItemRequest) => {
    await api.createItem(tripId, dayId, req); void refresh();
  }, [tripId, refresh]);

  const removeItem = useCallback(async (dayId: string, itemId: string) => {
    await api.deleteItem(tripId, dayId, itemId); void refresh();
  }, [tripId, refresh]);

  const moveItem = useCallback(async (dayId: string, items: { itemId: string; sortOrder: number }[]) => {
    await api.reorderItems(tripId, dayId, items); void refresh();
  }, [tripId, refresh]);

  return { itinerary, loading, error, refresh, addDay, removeDay, addItem, removeItem, moveItem };
}
