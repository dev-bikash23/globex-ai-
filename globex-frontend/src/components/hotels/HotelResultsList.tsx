import DataFreshnessNotice from '../search/DataFreshnessNotice';
import HotelCard from './HotelCard';
import type { HotelSearchResponse } from '../../types/phase5.types';

const SORT_OPTIONS = [
  { key: 'RECOMMENDED', label: '⭐ Recommended' },
  { key: 'PRICE_ASC',   label: '💰 Price (Low)' },
  { key: 'PRICE_DESC',  label: '💸 Price (High)' },
  { key: 'RATING',      label: '🏆 Rating' },
];

function HotelSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden flex animate-pulse">
      <div className="w-52 h-40 bg-white/10 shrink-0" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 w-48 rounded bg-white/10" />
        <div className="h-3 w-24 rounded bg-white/8" />
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="h-5 w-16 rounded-full bg-white/6" />)}
        </div>
      </div>
      <div className="p-4 text-right space-y-2">
        <div className="h-6 w-20 rounded bg-white/10" />
        <div className="h-3 w-14 rounded bg-white/6" />
      </div>
    </div>
  );
}

interface Props {
  response: HotelSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function HotelResultsList({ response, isLoading, error, sortBy, onSortChange }: Props) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-64 rounded-lg bg-white/6 animate-pulse mb-4" />
        {Array.from({ length: 4 }).map((_, i) => <HotelSkeleton key={i} />)}
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
        <div className="text-5xl mb-4">🏨</div>
        <div className="text-slate-300 font-semibold text-lg mb-2">Find your perfect stay</div>
        <div className="text-slate-500 text-sm">Enter your destination and travel dates to search for hotels.</div>
      </div>
    );
  }

  if (response.hotels.length === 0) {
    return (
      <div>
        <DataFreshnessNotice isTestData={response.isTestData} dataNotice={response.dataNotice} type="hotel" />
        <div className="rounded-2xl border border-white/5 bg-white/2 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-slate-300 font-semibold mb-2">No hotels found</div>
          <div className="text-slate-500 text-sm">Try a different destination or adjust your filters.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataFreshnessNotice isTestData={response.isTestData} dataNotice={response.dataNotice} type="hotel" />

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-slate-500 text-sm mr-1">{response.hotels.length} hotels</span>
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

      <div className="space-y-3">
        {response.hotels.map((hotel, i) => (
          <HotelCard key={hotel.hotelId} hotel={hotel} index={i} />
        ))}
      </div>
    </div>
  );
}
