import { Link } from 'react-router-dom';
import type { TripSummary } from '../types/trip.types';
import { TripStatusBadge } from './TripStatusBadge';

interface Props {
  trip: TripSummary;
  onArchive?: (id: string) => void;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

export function TripCard({ trip, onArchive }: Props) {
  const img = trip.destinationImageUrl;
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-teal)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
    >
      {img && (
        <div style={{ height: '9rem', overflow: 'hidden' }}>
          <img src={img} alt={trip.destinationName ?? trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
        </div>
      )}
      {!img && (
        <div style={{ height: '9rem', background: 'linear-gradient(135deg, var(--color-ocean) 0%, var(--color-teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>✈️</span>
        </div>
      )}
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h3 style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3, margin: 0 }}>{trip.title}</h3>
          <TripStatusBadge status={trip.status} />
        </div>
        {trip.destinationName && <p style={{ color: 'var(--color-slate)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>📍 {trip.destinationName}</p>}
        <p style={{ color: 'var(--color-slate)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{fmt(trip.startDate)} — {fmt(trip.endDate)}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '1rem' }}>
          <span>👤 {trip.travelerCount}</span>
          <span>✈️ {trip.flightCount}</span>
          <span>🏨 {trip.hotelCount}</span>
          <span>🎭 {trip.activityCount}</span>
          {trip.budgetLimit && <span>💰 {trip.currency} {trip.budgetLimit.toLocaleString()}</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/trips/${trip.id}`} style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '0.5rem', background: 'var(--color-navy)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, transition: 'background 0.2s' }}>View Trip</Link>
          <Link to={`/trips/${trip.id}/edit`} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--color-sand)', color: 'var(--color-navy)', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background 0.2s' }}>Edit</Link>
          {onArchive && (
            <button onClick={() => onArchive(trip.id)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--color-sand)', color: 'var(--color-slate)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'color 0.2s' }}>Archive</button>
          )}
        </div>
      </div>
    </div>
  );
}
