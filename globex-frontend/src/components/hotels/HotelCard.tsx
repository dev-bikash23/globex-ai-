import type { HotelOffer } from '../../types/phase5.types';

const AMENITY_ICONS: Record<string, string> = {
  WIFI: '📶', POOL: '🏊', SPA: '💆', GYM: '🏋️', RESTAURANT: '🍽️',
  BAR: '🍸', BEACH: '🏖️', ROOFTOP: '🏙️', TERRACE: '🌿', SAUNA: '🧖',
  CONCIERGE: '🛎️', VALET: '🚗', BUTLER: '🤵', WATERPARK: '🎢', ONSEN: '♨️',
  YOGA: '🧘', CASINO: '🎰', MALL: '🛍️', INFINITY_POOL: '🌊',
  '24H_CHECKIN': '🕐', COMMON_KITCHEN: '🍳', COMMON_AREA: '🛋️',
};

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-xs ${i < stars ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
      ))}
    </div>
  );
}

interface Props {
  hotel: HotelOffer;
  index: number;
}

export default function HotelCard({ hotel, index }: Props) {
  return (
    <div
      className="group rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7
                 hover:border-blue-500/30 transition-all duration-300 overflow-hidden flex gap-0 md:flex-row flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative w-full md:w-52 h-44 md:h-auto shrink-0 overflow-hidden">
        {hotel.mainImageUrl ? (
          <img
            src={hotel.mainImageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl">🏨</div>
        )}
        {hotel.isTestData && (
          <div className="absolute top-2 left-2 bg-purple-500/30 backdrop-blur-sm text-purple-300
                          text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/40">
            🎭 Demo
          </div>
        )}
        {hotel.freeCancellation && (
          <div className="absolute bottom-2 left-2 bg-emerald-500/25 backdrop-blur-sm text-emerald-400
                          text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Free Cancel
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-white font-semibold text-base leading-snug mb-1">{hotel.name}</h3>
              <StarRating stars={hotel.stars} />
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-white">
                {hotel.pricePerNight.currency} {Number(hotel.pricePerNight.amount).toLocaleString()}
              </div>
              <div className="text-slate-500 text-xs">per night</div>
              {hotel.nights > 1 && (
                <div className="text-slate-400 text-xs mt-0.5">
                  Total: {hotel.totalPrice.currency} {Number(hotel.totalPrice.amount).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <span>📍</span>
            <span className="truncate">{hotel.location}</span>
            {hotel.guestRating && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-emerald-400 font-semibold">⭐ {hotel.guestRating.toFixed(1)}</span>
              </>
            )}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.slice(0, 6).map(a => (
              <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400">
                {AMENITY_ICONS[a] || '•'} {a.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
            {hotel.amenities.length > 6 && (
              <span className="text-xs text-slate-600">+{hotel.amenities.length - 6} more</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="text-xs text-slate-500 flex gap-3">
            <span>🛏️ {hotel.roomType}</span>
            {hotel.breakfastIncluded && <span className="text-emerald-400">🍳 Breakfast</span>}
          </div>
          <button
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold
                       rounded-lg transition-colors duration-200"
          >
            View Hotel →
          </button>
        </div>
      </div>
    </div>
  );
}
