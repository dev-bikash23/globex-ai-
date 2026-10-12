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
    if (stops === 0) return <span className="text-emerald-400 text-xs font-semibold">Direct</span>;
    return <span className="text-amber-400 text-xs font-semibold">{stops} stop{stops > 1 ? 's' : ''}</span>;
  };

  return (
    <div
      className="group relative rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7
                 hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Test data ribbon */}
      {offer.isTestData && (
        <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-400 text-[10px] font-bold
                        px-2 py-0.5 rounded-bl-lg border-l border-b border-amber-500/30">
          🧪 Sandbox
        </div>
      )}

      <div className="p-5">
        {/* Header: Airline + Price */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {offer.airlineLogoUrl ? (
              <img src={offer.airlineLogoUrl} alt={offer.airline}
                   className="w-9 h-9 rounded-lg object-contain bg-white/10 p-1" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30
                              flex items-center justify-center text-blue-400 font-bold text-xs">
                {offer.airlineCode || '✈'}
              </div>
            )}
            <div>
              <div className="text-white font-semibold text-sm">{offer.airline}</div>
              <div className="text-slate-500 text-xs">{offer.cabinClassDisplay}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {offer.totalPrice.currency} {Number(offer.totalPrice.amount).toLocaleString()}
            </div>
            <div className="text-slate-500 text-xs">per person</div>
            {offer.refundable && (
              <div className="text-emerald-400 text-xs font-medium mt-0.5">✓ Refundable</div>
            )}
          </div>
        </div>

        {/* Outbound flight timeline */}
        <div className="mb-3">
          <div className="flex items-center gap-3">
            <div className="text-center shrink-0 w-16">
              <div className="text-white font-bold text-lg leading-none">
                {outbound ? formatTime(outbound.departureTime) : '--'}
              </div>
              <div className="text-slate-400 text-xs font-mono mt-0.5">
                {outbound?.departureAirportCode || '--'}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="text-slate-500 text-xs">{formatDuration(offer.totalDurationMinutes)}</div>
              <div className="w-full flex items-center gap-1">
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600 via-blue-500/40 to-slate-600" />
                <div className="text-slate-600 text-xs">✈</div>
              </div>
              <div>{stopsLabel(offer.outboundSegments)}</div>
            </div>

            <div className="text-center shrink-0 w-16">
              <div className="text-white font-bold text-lg leading-none">
                {lastOutbound ? formatTime(lastOutbound.arrivalTime) : '--'}
              </div>
              <div className="text-slate-400 text-xs font-mono mt-0.5">
                {lastOutbound?.arrivalAirportCode || '--'}
              </div>
            </div>
          </div>
          {outbound && (
            <div className="text-slate-600 text-xs text-center mt-1">
              {outbound.departureCityName} → {lastOutbound?.arrivalCityName}
              {' · '}{formatDate(outbound.departureTime)}
            </div>
          )}
        </div>

        {/* Return flight (if round trip) */}
        {hasReturn && ret && lastRet && (
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="text-center shrink-0 w-16">
                <div className="text-white font-semibold text-base leading-none">
                  {formatTime(ret.departureTime)}
                </div>
                <div className="text-slate-400 text-xs font-mono mt-0.5">{ret.departureAirportCode}</div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="text-slate-500 text-xs">Return</div>
                <div className="w-full h-px bg-gradient-to-r from-slate-600 via-cyan-500/40 to-slate-600" />
                <div>{stopsLabel(offer.returnSegments!)}</div>
              </div>

              <div className="text-center shrink-0 w-16">
                <div className="text-white font-semibold text-base leading-none">
                  {formatTime(lastRet.arrivalTime)}
                </div>
                <div className="text-slate-400 text-xs font-mono mt-0.5">{lastRet.arrivalAirportCode}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer: Baggage + Conditions */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>🧳 {offer.baggageAllowance}</span>
            {offer.changeable && <span className="text-slate-500">📅 Date change</span>}
          </div>
          <a
            href="https://duffel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold
                       rounded-lg transition-colors duration-200 shrink-0"
          >
            View Deal →
          </a>
        </div>
      </div>
    </div>
  );
}
