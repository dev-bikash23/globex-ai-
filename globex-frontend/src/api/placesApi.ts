import type { PlaceResponse, LocalTimeInfo } from '../types/phase4.types';

export const placesApi = {
  async getPlaces(destinationId: string, category?: string, limit = 20): Promise<PlaceResponse[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (category) params.set('category', category);
    const res = await fetch(`/api/v1/destinations/${destinationId}/places?${params}`);
    if (!res.ok) throw new Error(`Places fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as PlaceResponse[];
  },
};

export const timezoneApi = {
  async getLocalTime(destinationId: string): Promise<LocalTimeInfo> {
    const res = await fetch(`/api/v1/destinations/${destinationId}/time`);
    if (!res.ok) throw new Error(`Timezone fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as LocalTimeInfo;
  },
};
