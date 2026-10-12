import { Html } from '@react-three/drei';
import { latLngToVector3 } from '../../utils/coordinates';
import type { DestinationSummary } from '../../types/destination.types';

interface Props {
  destination: DestinationSummary;
  selected: boolean;
  onSelect: (d: DestinationSummary) => void;
}

export function DestinationMarker({ destination, selected, onSelect }: Props) {
  const pos = latLngToVector3(destination.latitude, destination.longitude, 1.03);

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <Html
        center
        distanceFactor={8}
        occlude={false}
        style={{ pointerEvents: 'auto', userSelect: 'none' }}
      >
        <button
          className={`globe-marker${selected ? ' globe-marker--selected' : ''}`}
          onClick={() => onSelect(destination)}
          title={`${destination.name}, ${destination.countryName}`}
          aria-label={`View ${destination.name}`}
        >
          <span className="globe-marker__dot" />
          {selected && (
            <span className="globe-marker__label">
              {destination.flagEmoji} {destination.name}
            </span>
          )}
        </button>
      </Html>
    </group>
  );
}
