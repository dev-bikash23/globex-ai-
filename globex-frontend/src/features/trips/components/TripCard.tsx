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
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all group">
      {img && (
        <div className="h-36 overflow-hidden">
          <img src={img} alt={trip.destinationName ?? trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      {!img && (
        <div className="h-36 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
          <span className="text-4xl">✈️</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">{trip.title}</h3>
          <TripStatusBadge status={trip.status} />
        </div>
        {trip.destinationName && <p className="text-slate-400 text-xs mb-2">📍 {trip.destinationName}</p>}
        <p className="text-slate-400 text-xs mb-3">{fmt(trip.startDate)} — {fmt(trip.endDate)}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
          <span>👤 {trip.travelerCount}</span>
          <span>✈️ {trip.flightCount}</span>
          <span>🏨 {trip.hotelCount}</span>
          <span>🎭 {trip.activityCount}</span>
          {trip.budgetLimit && <span>💰 {trip.currency} {trip.budgetLimit.toLocaleString()}</span>}
        </div>
        <div className="flex gap-2">
          <Link to={`/trips/${trip.id}`} className="flex-1 text-center text-xs py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">View Trip</Link>
          <Link to={`/trips/${trip.id}/edit`} className="px-3 text-xs py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">Edit</Link>
          {onArchive && (
            <button onClick={() => onArchive(trip.id)} className="px-3 text-xs py-2 bg-slate-700 hover:bg-red-800/40 text-slate-400 hover:text-red-400 rounded-lg transition-colors">Archive</button>
          )}
        </div>
      </div>
    </div>
  );
}
