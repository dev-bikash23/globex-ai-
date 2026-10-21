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
    <div style={{ display: 'flex', gap: '0.125rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: '0.75rem', color: i < stars ? '#F59E0B' : '#CBD5E1' }}>★</span>
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
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-teal)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '13rem', flexShrink: 0, overflow: 'hidden' }}>
        {hotel.mainImageUrl ? (
          <img src={hotel.mainImageUrl} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--color-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🏨</div>
        )}
        {hotel.isTestData && (
          <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: '#EDE9FE', color: '#7C3AED', fontSize: '0.625rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #C4B5FD' }}>
            🎭 Demo
          </div>
        )}
        {hotel.freeCancellation && (
          <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: '#DCFCE7', color: '#166534', fontSize: '0.625rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #BBF7D0' }}>
            Free Cancel
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div>
              <h3 style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{hotel.name}</h3>
              <StarRating stars={hotel.stars} />
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                {hotel.pricePerNight.currency} {Number(hotel.pricePerNight.amount).toLocaleString()}
              </div>
              <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>per night</div>
              {hotel.nights > 1 && (
                <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                  Total: {hotel.totalPrice.currency} {Number(hotel.totalPrice.amount).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
            <span>📍</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hotel.location}</span>
            {hotel.guestRating && (
              <>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>⭐ {hotel.guestRating.toFixed(1)}</span>
              </>
            )}
          </div>

          {/* Amenities */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
            {hotel.amenities.slice(0, 6).map(a => (
              <span key={a} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'var(--color-ivory)', border: '1px solid var(--color-border)', color: 'var(--color-slate)' }}>
                {AMENITY_ICONS[a] || '•'} {a.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
            {hotel.amenities.length > 6 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>+{hotel.amenities.length - 6} more</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', display: 'flex', gap: '0.75rem' }}>
            <span>🛏️ {hotel.roomType}</span>
            {hotel.breakfastIncluded && <span style={{ color: '#16A34A' }}>🍳 Breakfast</span>}
          </div>
          <button style={{ padding: '0.375rem 1rem', background: 'var(--color-navy)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background 0.2s' }}>
            View Hotel →
          </button>
        </div>
      </div>
    </div>
  );
}
