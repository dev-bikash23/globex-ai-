import * as THREE from 'three';

/**
 * GlobeX Coordinate Utility
 * =========================
 * Converts geographic lat/lng to 3D Cartesian coordinates on a unit sphere.
 *
 * Coordinate system (Three.js standard):
 *   Y-up, right-hand rule.
 *
 * Conversion:
 *   phi    = latitude  in radians
 *   lambda = longitude in radians
 *   x = r * cos(phi) * sin(lambda)   — East/West
 *   y = r * sin(phi)                 — North/South
 *   z = r * cos(phi) * cos(lambda)   — Depth
 *
 * Example — Tokyo (35.68°N, 139.65°E):
 *   x ≈  0.532, y ≈  0.582, z ≈ -0.614
 */
export function latLngToVector3(lat: number, lng: number, radius = 1.0): THREE.Vector3 {
  const phi    = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda)
  );
}

/** Camera position to look at a lat/lng point from a given distance */
export function cameraPositionForCoords(lat: number, lng: number, distance = 2.5): THREE.Vector3 {
  return latLngToVector3(lat, lng, distance);
}

/** Format lat/lng as a human-readable coordinate string */
export function formatCoords(lat: number, lng: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}
