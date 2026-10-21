import type { TripStatus } from '../types/trip.types';

const STATUS_STYLES: Record<TripStatus, { bg: string; color: string; border: string }> = {
  PLANNING:    { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  CONFIRMED:   { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  IN_PROGRESS: { bg: '#FAF5FF', color: '#7E22CE', border: '#E9D5FF' },
  COMPLETED:   { bg: '#F8FAFC', color: '#475569', border: '#CBD5E1' },
  CANCELLED:   { bg: '#FFF1F2', color: '#BE123C', border: '#FECDD3' },
  ARCHIVED:    { bg: '#F9FAFB', color: '#6B7280', border: '#D1D5DB' },
};
const STATUS_LABELS: Record<TripStatus, string> = {
  PLANNING: 'Planning', CONFIRMED: 'Confirmed', IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed', CANCELLED: 'Cancelled', ARCHIVED: 'Archived',
};

export function TripStatusBadge({ status }: { status: TripStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      padding: '0.15rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.7rem',
      fontWeight: 600,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status]}
    </span>
  );
}
