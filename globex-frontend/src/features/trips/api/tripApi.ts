// =============================================================================
// Trip API client — all calls require Bearer token (authenticated endpoints)
// =============================================================================
import type {
  Trip, TripSummary, TripListResponse, TripTraveler, TripFlight, TripHotel, TripActivity,
  ItineraryResponse, ItineraryDay, ItineraryItem, TripExpense, BudgetSummary,
  CreateTripRequest, UpdateTripRequest, AddTravelerRequest,
  AttachFlightRequest, AttachHotelRequest, AttachActivityRequest,
  CreateItineraryDayRequest, CreateItineraryItemRequest, CreateExpenseRequest,
} from '../types/trip.types';

const BASE = '/api/v1';

function getToken(): string {
  // Access token is held in AuthProvider state; read from sessionStorage fallback
  return sessionStorage.getItem('accessToken') ?? localStorage.getItem('accessToken') ?? '';
}

function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? 'API error');
  return json.data as T;
}

// ── Trips ─────────────────────────────────────────────────────────────────────
export const createTrip = (body: CreateTripRequest) =>
  req<Trip>('POST', `${BASE}/trips`, body);

export const listTrips = () =>
  req<TripListResponse>('GET', `${BASE}/trips`);

export const getTrip = (id: string) =>
  req<Trip>('GET', `${BASE}/trips/${id}`);

export const updateTrip = (id: string, body: UpdateTripRequest) =>
  req<Trip>('PUT', `${BASE}/trips/${id}`, body);

export const updateTripStatus = (id: string, status: string) =>
  req<Trip>('PATCH', `${BASE}/trips/${id}/status`, { status });

export const deleteTrip = (id: string, mode: 'archive' | 'hard' = 'archive') =>
  req<void>('DELETE', `${BASE}/trips/${id}?mode=${mode}`);

export const getTripSummary = (id: string) =>
  req<TripSummary>('GET', `${BASE}/trips/${id}/summary`);

// ── Travelers ─────────────────────────────────────────────────────────────────
export const getTravelers = (tripId: string) =>
  req<TripTraveler[]>('GET', `${BASE}/trips/${tripId}/travelers`);

export const addTraveler = (tripId: string, body: AddTravelerRequest) =>
  req<TripTraveler>('POST', `${BASE}/trips/${tripId}/travelers`, body);

export const removeTraveler = (tripId: string, travelerId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/travelers/${travelerId}`);

// ── Flights ───────────────────────────────────────────────────────────────────
export const getFlights = (tripId: string) =>
  req<TripFlight[]>('GET', `${BASE}/trips/${tripId}/flights`);

export const attachFlight = (tripId: string, body: AttachFlightRequest) =>
  req<TripFlight>('POST', `${BASE}/trips/${tripId}/flights`, body);

export const removeFlight = (tripId: string, flightId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/flights/${flightId}`);

// ── Hotels ────────────────────────────────────────────────────────────────────
export const getHotels = (tripId: string) =>
  req<TripHotel[]>('GET', `${BASE}/trips/${tripId}/hotels`);

export const attachHotel = (tripId: string, body: AttachHotelRequest) =>
  req<TripHotel>('POST', `${BASE}/trips/${tripId}/hotels`, body);

export const removeHotel = (tripId: string, hotelId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/hotels/${hotelId}`);

// ── Activities ────────────────────────────────────────────────────────────────
export const getActivities = (tripId: string) =>
  req<TripActivity[]>('GET', `${BASE}/trips/${tripId}/activities`);

export const attachActivity = (tripId: string, body: AttachActivityRequest) =>
  req<TripActivity>('POST', `${BASE}/trips/${tripId}/activities`, body);

export const removeActivity = (tripId: string, actId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/activities/${actId}`);

// ── Itinerary ─────────────────────────────────────────────────────────────────
export const getItinerary = (tripId: string) =>
  req<ItineraryResponse>('GET', `${BASE}/trips/${tripId}/itinerary`);

export const createDay = (tripId: string, body: CreateItineraryDayRequest) =>
  req<ItineraryDay>('POST', `${BASE}/trips/${tripId}/itinerary/days`, body);

export const updateDay = (tripId: string, dayId: string, body: Partial<CreateItineraryDayRequest>) =>
  req<ItineraryDay>('PUT', `${BASE}/trips/${tripId}/itinerary/days/${dayId}`, body);

export const deleteDay = (tripId: string, dayId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/itinerary/days/${dayId}`);

export const createItem = (tripId: string, dayId: string, body: CreateItineraryItemRequest) =>
  req<ItineraryItem>('POST', `${BASE}/trips/${tripId}/itinerary/days/${dayId}/items`, body);

export const updateItem = (tripId: string, dayId: string, itemId: string, body: CreateItineraryItemRequest) =>
  req<ItineraryItem>('PUT', `${BASE}/trips/${tripId}/itinerary/days/${dayId}/items/${itemId}`, body);

export const deleteItem = (tripId: string, dayId: string, itemId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/itinerary/days/${dayId}/items/${itemId}`);

export const reorderItems = (tripId: string, dayId: string, items: { itemId: string; sortOrder: number }[]) =>
  req<void>('PUT', `${BASE}/trips/${tripId}/itinerary/days/${dayId}/items/reorder`, { items });

// ── Budget & Expenses ─────────────────────────────────────────────────────────
export const getBudget = (tripId: string) =>
  req<BudgetSummary>('GET', `${BASE}/trips/${tripId}/budget`);

export const getExpenses = (tripId: string) =>
  req<TripExpense[]>('GET', `${BASE}/trips/${tripId}/expenses`);

export const addExpense = (tripId: string, body: CreateExpenseRequest) =>
  req<TripExpense>('POST', `${BASE}/trips/${tripId}/expenses`, body);

export const updateExpense = (tripId: string, expId: string, body: CreateExpenseRequest) =>
  req<TripExpense>('PUT', `${BASE}/trips/${tripId}/expenses/${expId}`, body);

export const deleteExpense = (tripId: string, expId: string) =>
  req<void>('DELETE', `${BASE}/trips/${tripId}/expenses/${expId}`);

export const setBudgetLimit = (tripId: string, budgetLimit: number) =>
  req<void>('PUT', `${BASE}/trips/${tripId}/budget/limit`, { budgetLimit });
