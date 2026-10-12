import DataFreshnessNotice from '../search/DataFreshnessNotice';
import ActivityCard from './ActivityCard';
import type { ActivitySearchResponse } from '../../types/phase5.types';

const CATEGORIES = [
  { key: 'ALL', label: '🌍 All' },
  { key: 'SIGHTSEEING', label: '🏛️ Sightseeing' },
  { key: 'TOURS', label: '🗺️ Tours' },
  { key: 'FOOD', label: '🍜 Food' },
  { key: 'ADVENTURE', label: '🧗 Adventure' },
  { key: 'MUSEUMS', label: '🏛 Museums' },
  { key: 'NATURE', label: '🌿 Nature' },
  { key: 'CULTURAL', label: '🎭 Cultural' },
  { key: 'WELLNESS', label: '🧘 Wellness' },
];

function ActivitySkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden flex animate-pulse">
      <div className="w-48 h-36 bg-white/10 shrink-0" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 w-56 rounded bg-white/10" />
        <div className="h-3 w-16 rounded-full bg-white/8" />
        <div className="h-3 w-full rounded bg-white/6" />
        <div className="h-3 w-3/4 rounded bg-white/6" />
      </div>
    </div>
  );
}

interface Props {
  response: ActivitySearchResponse | null;
  isLoading: boolean;
  error: string | null;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function ActivityResultsList({
  response, isLoading, error, activeCategory, onCategoryChange
}: Props) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.slice(0, 5).map(c => (
            <div key={c.key} className="h-8 w-24 rounded-lg bg-white/6 animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => <ActivitySkeleton key={i} />)}
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
        <div className="text-5xl mb-4">🎟️</div>
        <div className="text-slate-300 font-semibold text-lg mb-2">Discover experiences</div>
        <div className="text-slate-500 text-sm">Search for tours, food experiences, and activities at your destination.</div>
      </div>
    );
  }

  return (
    <div>
      <DataFreshnessNotice isTestData={response.isTestData} dataNotice={response.dataNotice} type="activity" />

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => onCategoryChange(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
              ${activeCategory === c.key
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/8 hover:text-white'
              }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="text-slate-500 text-sm mb-4">{response.activities.length} activities</div>

      {response.activities.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/2 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-slate-300 font-semibold mb-2">No activities found</div>
          <div className="text-slate-500 text-sm">Try a different category or destination.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {response.activities.map((activity, i) => (
            <ActivityCard key={activity.activityId} activity={activity} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
