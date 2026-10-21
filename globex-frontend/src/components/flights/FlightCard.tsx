import type { FlightOffer } from '../../types/phase5.types';

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(iso: string) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface Props {
  offer: FlightOffer;
  index: number;
}

export default function FlightCard({ offer, index }: Props) {
  const outbound = offer.outboundSegments?.[0];
  const lastOutbound = offer.outboundSegments?.[offer.outboundSegments.length - 1];
  const hasReturn = offer.returnSegments && offer.returnSegments.length > 0;
  const ret = hasReturn ? offer.returnSegments![0] : null;
  const lastRet = hasReturn ? offer.returnSegments![offer.returnSegments!.length - 1] : null;

  const stopsLabel = (segments: typeof offer.outboundSegments) => {
    const stops = segments.length - 1;
    if (stops === 0) return <span style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: 600 }}>Direct</span>;
    return <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 600 }}>{stops} stop{stops > 1 ? 's' : ''}</span>;
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-teal)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
    >
      {/* Sandbox ribbon */}
      {offer.isTestData && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: '#FEF3C7', color: '#92400E', fontSize: '0.625rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderBottomLeftRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
          🧪 Sandbox
        </div>
      )}

      <div style={{ padding: '1.25rem' }}>
        {/* Header: Airline + Price */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {offer.airlineLogoUrl ? (
              <img src={offer.airlineLogoUrl} alt={offer.airline}
                   style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-md)', objectFit: 'contain', background: 'var(--color-sand)', padding: '0.2rem' }} />
            ) : (
              <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-md)', background: 'var(--color-sand)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ocean)', fontWeight: 700, fontSize: '0.75rem' }}>
                {offer.airlineCode || '✈'}
              </div>
            )}
            <div>
              <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.875rem' }}>{offer.airline}</div>
              <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>{offer.cabinClassDisplay}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              {offer.totalPrice.currency} {Number(offer.totalPrice.amount).toLocaleString()}
            </div>
            <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>per person</div>
            {offer.refundable && (
              <div style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: 500, marginTop: '0.15rem' }}>✓ Refundable</div>
            )}
          </div>
        </div>

        {/* Outbound flight timeline */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'center', flexShrink: 0, width: '4rem' }}>
              <div style={{ color: 'var(--color-navy)', fontWeight: 700, fontSize: '1.125rem', lineHeight: 1 }}>
                {outbound ? formatTime(outbound.departureTime) : '--'}
              </div>
              <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                {outbound?.departureAirportCode || '--'}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>{formatDuration(offer.totalDurationMinutes)}</div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--color-border), var(--color-ocean), var(--color-border))' }} />
                <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>✈</div>
              </div>
              <div>{stopsLabel(offer.outboundSegments)}</div>
            </div>

            <div style={{ textAlign: 'center', flexShrink: 0, width: '4rem' }}>
              <div style={{ color: 'var(--color-navy)', fontWeight: 700, fontSize: '1.125rem', lineHeight: 1 }}>
                {lastOutbound ? formatTime(lastOutbound.arrivalTime) : '--'}
              </div>
              <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                {lastOutbound?.arrivalAirportCode || '--'}
              </div>
            </div>
          </div>
          {outbound && (
            <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.25rem' }}>
              {outbound.departureCityName} → {lastOutbound?.arrivalCityName}
              {' · '}{formatDate(outbound.departureTime)}
            </div>
          )}
        </div>

        {/* Return flight (if round trip) */}
        {hasReturn && ret && lastRet && (
          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center', flexShrink: 0, width: '4rem' }}>
                <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '1rem', lineHeight: 1 }}>
                  {formatTime(ret.departureTime)}
                </div>
                <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>{ret.departureAirportCode}</div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>Return</div>
                <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, var(--color-border), var(--color-teal), var(--color-border))' }} />
                <div>{stopsLabel(offer.returnSegments!)}</div>
              </div>

              <div style={{ textAlign: 'center', flexShrink: 0, width: '4rem' }}>
                <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '1rem', lineHeight: 1 }}>
                  {formatTime(lastRet.arrivalTime)}
                </div>
                <div style={{ color: 'var(--color-slate)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>{lastRet.arrivalAirportCode}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer: Baggage + Book */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-slate)' }}>
            <span>🧳 {offer.baggageAllowance}</span>
            {offer.changeable && <span>📅 Date change</span>}
          </div>
          <a
            href="https://duffel.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '0.375rem 1rem', background: 'var(--color-navy)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background 0.2s', flexShrink: 0 }}
          >
            View Deal →
          </a>
        </div>
      </div>
    </div>
  );
}
