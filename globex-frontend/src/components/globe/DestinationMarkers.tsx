import { DestinationMarker } from './DestinationMarker';
import type { DestinationSummary } from '../../types/destination.types';

interface Props {
  destinations: DestinationSummary[];
  selectedId: string | null;
  onSelect: (d: DestinationSummary) => void;
}

export function DestinationMarkers({ destinations, selectedId, onSelect }: Props) {
  const featured = destinations.filter(d => d.featured);
  return (
    <>
      {featured.map(dest => (
        <DestinationMarker
          key={dest.id}
          destination={dest}
          selected={selectedId === dest.id}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
