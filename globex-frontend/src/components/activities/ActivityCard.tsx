import type { ActivityOffer } from '../../types/phase5.types';

const CATEGORY_COLORS: Record<string, string> = {
  SIGHTSEEING: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  TOURS:       'bg-violet-500/20 text-violet-300 border-violet-500/30',
  FOOD:        'bg-orange-500/20 text-orange-300 border-orange-500/30',
  ADVENTURE:   'bg-red-500/20 text-red-300 border-red-500/30',
  MUSEUMS:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  NATURE:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  CULTURAL:    'bg-pink-500/20 text-pink-300 border-pink-500/30',
  WELLNESS:    'bg-teal-500/20 text-teal-300 border-teal-500/30',
  HISTORICAL:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

interface Props {
  activity: ActivityOffer;
  index: number;
}

export default function ActivityCard({ activity, index }: Props) {
  const catColor = CATEGORY_COLORS[activity.category] || 'bg-white/10 text-slate-300 border-white/15';

  return (
    <div
      className="group rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7
                 hover:border-blue-500/30 transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative w-full md:w-48 h-44 md:h-auto shrink-0 overflow-hidden">
        {activity.pictures[0] ? (
          <img
            src={activity.pictures[0]}
            alt={activity.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl">🎟️</div>
        )}
        {activity.isTestData && (
          <div className="absolute top-2 left-2 bg-purple-500/30 backdrop-blur-sm text-purple-300
                          text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/40">
            🎭 Demo
          </div>
        )}
        {activity.freeCancellation && (
          <div className="absolute bottom-2 left-2 bg-emerald-500/25 backdrop-blur-sm text-emerald-400
                          text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Free Cancel
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-white font-semibold text-sm leading-snug mb-1.5">{activity.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
                {activity.category}
              </span>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-white">
                {activity.pricePerPerson.currency} {Number(activity.pricePerPerson.amount).toLocaleString()}
              </div>
              <div className="text-slate-500 text-xs">per person</div>
            </div>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {activity.shortDescription}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>⏱ {activity.durationDisplay}</span>
            {activity.rating && (
              <span className="text-amber-400">⭐ {activity.rating.toFixed(1)}</span>
            )}
            {activity.reviewCount > 0 && (
              <span>({activity.reviewCount.toLocaleString()} reviews)</span>
            )}
          </div>

          {/* Inclusions */}
          {activity.inclusions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activity.inclusions.slice(0, 3).map((inc, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10
                                         border border-emerald-500/20 text-emerald-400">
                  ✓ {inc}
                </span>
              ))}
              {activity.inclusions.length > 3 && (
                <span className="text-xs text-slate-600">+{activity.inclusions.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-3">
          <div className="text-xs text-slate-600">{activity.cancellationPolicy}</div>
          <a
            href={activity.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold
                       rounded-lg transition-colors duration-200 shrink-0"
          >
            Book Now →
          </a>
        </div>
      </div>
    </div>
  );
}
