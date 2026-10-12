import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { cameraPositionForCoords } from '../../utils/coordinates';
import type { CameraTarget } from '../../hooks/useGlobeCamera';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface Props {
  target: CameraTarget | null;
}

export function GlobeControls({ target }: Props) {
  const { camera } = useThree();
  const targetPosition = useRef<THREE.Vector3 | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (target) {
      targetPosition.current = cameraPositionForCoords(target.lat, target.lng, 2.5);
      if (controlsRef.current) controlsRef.current.enabled = false;
    } else {
      targetPosition.current = null;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  }, [target]);

  useFrame(() => {
    if (!targetPosition.current) return;
    camera.position.lerp(targetPosition.current, 0.06);
    camera.lookAt(0, 0, 0);
    if (camera.position.distanceTo(targetPosition.current) < 0.02) {
      camera.position.copy(targetPosition.current);
      targetPosition.current = null;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={1.5}
      maxDistance={5.0}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      enableDamping
      dampingFactor={0.08}
      autoRotate={false}
    />
  );
}
