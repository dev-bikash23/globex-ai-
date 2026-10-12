/**
 * MapProvider abstraction — pluggable map embed strategy.
 *
 * Phase 3: OpenStreetMap iframe embed (no API key required, public domain).
 * Phase 4+: Swap to Mapbox/Google Maps by changing only this file.
 *
 * Consumers (DestinationDetail page) call getMapEmbedUrl() and never
 * depend on which provider is active.
 */
export interface MapProviderConfig {
  lat: number;
  lng: number;
  zoom?: number;
  markerLabel?: string;
}

/** Returns an embeddable iframe src URL for the given location */
export function getMapEmbedUrl(config: MapProviderConfig): string {
  const { lat, lng } = config;
  const delta = 0.05;
  return (
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}` +
    `&layer=mapnik&marker=${lat}%2C${lng}`
  );
}

/** Returns a link to open the location in OpenStreetMap */
export function getMapLinkUrl(config: MapProviderConfig): string {
  const { lat, lng, zoom = 13 } = config;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=${zoom}#map=${zoom}/${lat}/${lng}`;
}
