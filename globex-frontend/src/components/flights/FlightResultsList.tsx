import DataFreshnessNotice from '../search/DataFreshnessNotice';
import FlightCard from './FlightCard';
import type { FlightOffer, FlightSearchResponse } from '../../types/phase5.types';

const SORT_OPTIONS = [
  { key: 'CHEAPEST', label: '💰 Cheapest' },
  { key: 'FASTEST',  label: '⚡ Fastest' },
  { key: 'BEST',     label: '⭐ Best' },
  { key: 'EARLIEST', label: '🌅 Earliest' },
];

// Skeleton loader
function FlightSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/3 p-5 animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-white/10" />
            <div className="h-2 w-16 rounded bg-white/6" />
          </div>
        </div>
        <div className="h-7 w-24 rounded bg-white/10" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-6 w-14 rounded bg-white/10" />
        <div className="flex-1 h-px bg-white/8" />
        <div className="h-6 w-14 rounded bg-white/10" />
      </div>
    </div>
  );
}

interface Props {
  response: FlightSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  sortBy: string;
  onSortChange: (sort: string) => void;
  filteredOffers?: FlightSearchResponse['offers'];
}

export default function FlightResultsList({
  response, isLoading, error, sortBy, onSortChange, filteredOffers
}: Props) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-64 rounded-lg bg-white/6 animate-pulse mb-4" />
        {Array.from({ length: 5 }).map((_, i) => <FlightSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <div className="text-red-400 font-semibold mb-1">Search Failed</div>
        <div className="text-slate-500 text-sm">{error}</div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/2 p-12 text-center">
        <div className="text-5xl mb-4">✈️</div>
        <div className="text-slate-300 font-semibold text-lg mb-2">Ready to fly?</div>
        <div className="text-slate-500 text-sm">Enter your origin, destination and travel dates to search for flights.</div>
      </div>
    );
  }

  const offers = filteredOffers ?? response.offers;

  if (offers.length === 0) {
    return (
      <div>
        <DataFreshnessNotice isTestData={response.isTestData} dataNotice={response.dataNotice} type="flight" />
        <div className="rounded-2xl border border-white/5 bg-white/2 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-slate-300 font-semibold text-lg mb-2">No flights found</div>
          <div className="text-slate-500 text-sm">Try different dates or adjust your filters.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataFreshnessNotice isTestData={response.isTestData} dataNotice={response.dataNotice} type="flight" />

      {/* Sort bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-slate-500 text-sm mr-1">{offers.length} results</span>
        <div className="flex gap-1.5 flex-wrap">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => onSortChange(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
                ${sortBy === opt.key
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/8 hover:text-white'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {offers.map((offer: FlightOffer, i: number) => (
          <FlightCard key={offer.offerId} offer={offer} index={i} />
        ))}
      </div>
    </div>
  );
}
