import type { ActivityOffer } from '../../types/phase5.types';

const CATEGORY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  SIGHTSEEING: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  TOURS:       { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  FOOD:        { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  ADVENTURE:   { bg: '#FFF1F2', color: '#BE123C', border: '#FECDD3' },
  MUSEUMS:     { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  NATURE:      { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  CULTURAL:    { bg: '#FDF2F8', color: '#9D174D', border: '#FBCFE8' },
  WELLNESS:    { bg: '#F0FDFA', color: '#0F766E', border: '#99F6E4' },
  HISTORICAL:  { bg: '#FEFCE8', color: '#854D0E', border: '#FEF08A' },
};

interface Props {
  activity: ActivityOffer;
  index: number;
}

export default function ActivityCard({ activity, index }: Props) {
  const catStyle = CATEGORY_STYLES[activity.category] ?? { bg: 'var(--color-ivory)', color: 'var(--color-slate)', border: 'var(--color-border)' };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        display: 'flex',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-teal)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '12rem', flexShrink: 0, overflow: 'hidden' }}>
        {activity.pictures[0] ? (
          <img src={activity.pictures[0]} alt={activity.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--color-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎟️</div>
        )}
        {activity.isTestData && (
          <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: '#EDE9FE', color: '#7C3AED', fontSize: '0.625rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #C4B5FD' }}>🎭 Demo</div>
        )}
        {activity.freeCancellation && (
          <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: '#DCFCE7', color: '#166534', fontSize: '0.625rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #BBF7D0' }}>Free Cancel</div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div>
              <h3 style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.375rem' }}>{activity.name}</h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', border: `1px solid ${catStyle.border}`, background: catStyle.bg, color: catStyle.color }}>
                {activity.category}
              </span>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                {activity.pricePerPerson.currency} {Number(activity.pricePerPerson.amount).toLocaleString()}
              </div>
              <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>per person</div>
            </div>
          </div>

          <p style={{ color: 'var(--color-slate)', fontSize: '0.75rem', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {activity.shortDescription}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-slate)' }}>
            <span>⏱ {activity.durationDisplay}</span>
            {activity.rating && <span style={{ color: '#D97706' }}>⭐ {activity.rating.toFixed(1)}</span>}
            {activity.reviewCount > 0 && <span>({activity.reviewCount.toLocaleString()} reviews)</span>}
          </div>

          {/* Inclusions */}
          {activity.inclusions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
              {activity.inclusions.slice(0, 3).map((inc, i) => (
                <span key={i} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }}>
                  ✓ {inc}
                </span>
              ))}
              {activity.inclusions.length > 3 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>+{activity.inclusions.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{activity.cancellationPolicy}</div>
          <a href={activity.bookingLink} target="_blank" rel="noopener noreferrer"
            style={{ padding: '0.375rem 1rem', background: 'var(--color-navy)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background 0.2s', flexShrink: 0 }}>
            Book Now →
          </a>
        </div>
      </div>
    </div>
  );
}
