import type { DestinationImageResponse } from '../types/phase4.types';

export const imagesApi = {
  async getImages(destinationId: string, count = 6): Promise<DestinationImageResponse[]> {
    const res = await fetch(`/api/v1/destinations/${destinationId}/images?count=${count}`);
    if (!res.ok) throw new Error(`Images fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as DestinationImageResponse[];
  },
};
