import type {
  FlightSearchRequest, FlightSearchResponse,
  HotelSearchRequest, HotelSearchResponse,
  ActivitySearchRequest, ActivitySearchResponse,
  LocationSuggestion, SearchHistoryItem
} from '../types/phase5.types';

const API_BASE = 'http://localhost:8080/api/v1';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function post<T>(path: string, body: unknown, auth = false): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? getAuthHeaders() : {})
    },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || `HTTP ${res.status}`);
  }
  return json.data;
}

async function get<T>(path: string, auth = false): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...(auth ? getAuthHeaders() : {}) }
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || `HTTP ${res.status}`);
  }
  return json.data;
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || `HTTP ${res.status}`);
  }
  return json.data;
}

// ─── Flight API ───────────────────────────────────────────────────────────────

export const flightApi = {
  search: (req: FlightSearchRequest): Promise<FlightSearchResponse> =>
    post<FlightSearchResponse>('/flights/search', req, true)
};

// ─── Hotel API ────────────────────────────────────────────────────────────────

export const hotelApi = {
  search: (req: HotelSearchRequest): Promise<HotelSearchResponse> =>
    post<HotelSearchResponse>('/hotels/search', req, true)
};

// ─── Activity API ─────────────────────────────────────────────────────────────

export const activityApi = {
  search: (req: ActivitySearchRequest): Promise<ActivitySearchResponse> =>
    post<ActivitySearchResponse>('/activities/search', req, true)
};

// ─── Location Autocomplete ────────────────────────────────────────────────────

export const locationApi = {
  search: (q: string, limit = 10): Promise<LocationSuggestion[]> =>
    get<LocationSuggestion[]>(`/locations/search?q=${encodeURIComponent(q)}&limit=${limit}`)
};

// ─── Search History ───────────────────────────────────────────────────────────

export const searchHistoryApi = {
  get: (limit = 20): Promise<SearchHistoryItem[]> =>
    get<SearchHistoryItem[]>(`/users/me/search-history?limit=${limit}`, true),

  clear: (): Promise<{ deleted: number; message: string }> =>
    del('/users/me/search-history')
};
