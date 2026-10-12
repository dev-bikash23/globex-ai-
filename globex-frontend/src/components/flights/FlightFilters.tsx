import type { FlightSearchFilters } from '../../types/phase5.types';

interface Props {
  filters: FlightSearchFilters;
  selectedStops: number[];
  selectedAirlines: string[];
  maxPriceFilter: number;
  onStopToggle: (stops: number) => void;
  onAirlineToggle: (airline: string) => void;
  onMaxPriceChange: (price: number) => void;
}

export default function FlightFilters({
  filters, selectedStops, selectedAirlines,
  maxPriceFilter, onStopToggle, onAirlineToggle, onMaxPriceChange
}: Props) {

  const stopLabels: Record<number, string> = { 0: 'Non-stop', 1: '1 Stop', 2: '2+ Stops' };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
          Stops
        </h3>
        <div className="space-y-2">
          {filters.stopCounts.map(stops => (
            <label key={stops} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStops.includes(stops)}
                onChange={() => onStopToggle(stops)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500
                           accent-blue-500 cursor-pointer"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {stopLabels[stops] ?? `${stops} Stops`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
          Max Price ({filters.priceCurrency})
        </h3>
        <input
          type="range"
          min={Math.floor(filters.minPrice)}
          max={Math.ceil(filters.maxPrice)}
          value={maxPriceFilter}
          onChange={e => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{filters.priceCurrency} {Math.floor(filters.minPrice).toLocaleString()}</span>
          <span className="text-blue-400 font-semibold">
            {filters.priceCurrency} {maxPriceFilter.toLocaleString()}
          </span>
          <span>{filters.priceCurrency} {Math.ceil(filters.maxPrice).toLocaleString()}</span>
        </div>
      </div>

      {filters.airlines.length > 0 && (
        <div className="border-t border-white/5 pt-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>
            Airlines
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {filters.airlines.map(airline => (
              <label key={airline} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(airline)}
                  onChange={() => onAirlineToggle(airline)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                  {airline}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
