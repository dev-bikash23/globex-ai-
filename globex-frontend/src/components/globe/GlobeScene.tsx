import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Globe } from './Globe';
import type { DestinationSummary } from '../../types/destination.types';
import type { CameraTarget } from '../../hooks/useGlobeCamera';

interface Props {
  destinations: DestinationSummary[];
  selectedId: string | null;
  cameraTarget: CameraTarget | null;
  onSelectDestination: (d: DestinationSummary) => void;
}

export function GlobeScene({ destinations, selectedId, cameraTarget, onSelectDestination }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Globe
          destinations={destinations}
          selectedId={selectedId}
          cameraTarget={cameraTarget}
          onSelectDestination={onSelectDestination}
        />
      </Suspense>
    </Canvas>
  );
}
