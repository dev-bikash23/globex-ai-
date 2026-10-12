import type { ApiPage, Destination, DestinationSummary, Country } from '../types/destination.types';

const BASE = '/api/v1';

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  const json = await res.json();
  return json.data;
}

export const destinationApi = {
  /** Featured destinations for globe markers — cached on backend */
  getFeatured: (): Promise<DestinationSummary[]> =>
    get(`${BASE}/destinations/featured`),

  /** Paginated destination list */
  getAll: (page = 0, size = 20): Promise<ApiPage<Destination>> =>
    get(`${BASE}/destinations?page=${page}&size=${size}`),

  /** Single destination by ID */
  getById: (id: string): Promise<Destination> =>
    get(`${BASE}/destinations/${id}`),

  /** Single destination by URL slug */
  getBySlug: (slug: string): Promise<Destination> =>
    get(`${BASE}/destinations/slug/${slug}`),

  /** Cross-entity keyword search */
  search: (q: string, page = 0, size = 10): Promise<ApiPage<DestinationSummary>> =>
    get(`${BASE}/destinations/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),

  /** Full country list */
  getCountries: (): Promise<Country[]> =>
    get(`${BASE}/countries`),
};
