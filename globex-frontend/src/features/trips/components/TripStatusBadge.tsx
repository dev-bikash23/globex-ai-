import type { TripStatus } from '../types/trip.types';

const STATUS_STYLES: Record<TripStatus, string> = {
  PLANNING:    'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  CONFIRMED:   'bg-green-500/20 text-green-300 border border-green-500/30',
  IN_PROGRESS: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  COMPLETED:   'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  CANCELLED:   'bg-red-500/20 text-red-300 border border-red-500/30',
  ARCHIVED:    'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};
const STATUS_LABELS: Record<TripStatus, string> = {
  PLANNING: 'Planning', CONFIRMED: 'Confirmed', IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed', CANCELLED: 'Cancelled', ARCHIVED: 'Archived',
};

export function TripStatusBadge({ status }: { status: TripStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
