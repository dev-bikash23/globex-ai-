import { Suspense } from 'react';
import { EarthSurface } from './EarthSurface';
import { EarthAtmosphere } from './EarthAtmosphere';
import { StarField } from './StarField';
import { DestinationMarkers } from './DestinationMarkers';
import { GlobeControls } from './GlobeControls';
import type { DestinationSummary } from '../../types/destination.types';
import type { CameraTarget } from '../../hooks/useGlobeCamera';

interface Props {
  destinations: DestinationSummary[];
  selectedId: string | null;
  cameraTarget: CameraTarget | null;
  onSelectDestination: (d: DestinationSummary) => void;
}

export function Globe({ destinations, selectedId, cameraTarget, onSelectDestination }: Props) {
  return (
    <>
      {/* Lighting — sun from top-right, dim fill from back */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.3} color={0xffffff} />
      <directionalLight position={[-5, -3, -5]} intensity={0.08} color={0x4488ff} />

      <StarField />

      <Suspense fallback={null}>
        <EarthSurface />
        <EarthAtmosphere />
        <DestinationMarkers
          destinations={destinations}
          selectedId={selectedId}
          onSelect={onSelectDestination}
        />
      </Suspense>

      <GlobeControls target={cameraTarget} />
    </>
  );
}
