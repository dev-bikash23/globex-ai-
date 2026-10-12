import type { WeatherResponse } from '../types/phase4.types';

const BASE = '/api/v1/destinations';

export const weatherApi = {
  async getWeather(destinationId: string): Promise<WeatherResponse> {
    const res = await fetch(`${BASE}/${destinationId}/weather`);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as WeatherResponse;
  },
};
