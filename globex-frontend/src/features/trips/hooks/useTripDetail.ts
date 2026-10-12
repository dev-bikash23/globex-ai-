import { useState, useEffect, useCallback } from 'react';
import { getTrip, getFlights, getHotels, getActivities, getTravelers } from '../api/tripApi';
import type { Trip, TripFlight, TripHotel, TripActivity, TripTraveler } from '../types/trip.types';

export function useTripDetail(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [flights, setFlights] = useState<TripFlight[]>([]);
  const [hotels, setHotels] = useState<TripHotel[]>([]);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [travelers, setTravelers] = useState<TripTraveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!tripId) return;
    setLoading(true); setError(null);
    try {
      const [t, f, h, a, tv] = await Promise.all([
        getTrip(tripId), getFlights(tripId), getHotels(tripId),
        getActivities(tripId), getTravelers(tripId),
      ]);
      setTrip(t); setFlights(f); setHotels(h); setActivities(a); setTravelers(tv);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load trip'); }
    finally { setLoading(false); }
  }, [tripId]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { trip, flights, hotels, activities, travelers, loading, error, refresh };
}
