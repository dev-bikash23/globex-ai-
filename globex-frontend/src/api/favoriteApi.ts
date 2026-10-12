import { authService } from '../auth/authService';
import type { FavoriteResponse } from '../types/destination.types';

const BASE = '/api/v1/users/me/favorites';

function authHeaders(): HeadersInit {
  const token = authService.getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function authGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function authPost<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: authHeaders() });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function authDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: 'DELETE', headers: authHeaders() });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error(`API error ${res.status}`);
}

export const favoriteApi = {
  getMyFavorites: (): Promise<FavoriteResponse[]> =>
    authGet(`${BASE}/destinations`),

  addFavorite: (destinationId: string): Promise<FavoriteResponse> =>
    authPost(`${BASE}/destinations/${destinationId}`),

  removeFavorite: (destinationId: string): Promise<void> =>
    authDelete(`${BASE}/destinations/${destinationId}`),
};
