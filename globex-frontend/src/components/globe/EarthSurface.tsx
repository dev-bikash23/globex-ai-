import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

// Fast-loading, freely-licensed Earth texture from Three.js examples CDN
const EARTH_TEXTURE_URL =
  'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';

function EarthMesh() {
  const texture = useTexture(EARTH_TEXTURE_URL);

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={texture}
        specular={new THREE.Color(0x222222)}
        shininess={8}
      />
    </mesh>
  );
}

/** Fallback shown while texture loads */
function EarthFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial color={new THREE.Color(0x1e3a5f)} />
    </mesh>
  );
}

export function EarthSurface() {
  return (
    <Suspense fallback={<EarthFallback />}>
      <EarthMesh />
    </Suspense>
  );
}
