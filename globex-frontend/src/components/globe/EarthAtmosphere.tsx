import * as THREE from 'three';

/** Subtle blue atmospheric glow rendered on the back face of a slightly larger sphere */
export function EarthAtmosphere() {
  return (
    <mesh scale={[1.03, 1.03, 1.03]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
        color={new THREE.Color(0x3b82f6)}
        transparent
        opacity={0.07}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
