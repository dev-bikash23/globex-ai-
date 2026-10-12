import { Link } from 'react-router-dom';
import { useTrips } from '../../features/trips/hooks/useTrips';
import { TripCard } from '../../features/trips/components/TripCard';

export default function TripsPage() {
  const { data, loading, error, archive } = useTrips();

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading trips…</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-red-400 text-sm">{error}</div>
    </div>
  );

  const upcoming = data?.upcoming ?? [];
  const planning = data?.planning ?? [];
  const past     = data?.past ?? [];
  const hasTrips = upcoming.length + planning.length + past.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Trips</h1>
            <p className="text-slate-400 text-sm mt-1">{data?.totalCount ?? 0} trip{data?.totalCount !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/trips/new" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg">
            ✈️ New Trip
          </Link>
        </div>

        {!hasTrips && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🗺️</p>
            <h2 className="text-xl font-semibold text-slate-200 mb-2">No trips yet</h2>
            <p className="text-slate-400 text-sm mb-6">Create your first trip to start planning your adventure.</p>
            <Link to="/trips/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">Start Planning</Link>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-4">Upcoming</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map(t => <TripCard key={t.id} trip={t} onArchive={archive} />)}
            </div>
          </section>
        )}

        {planning.length > 0 && (
          <section className="mb-10">
            <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-4">Planning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {planning.map(t => <TripCard key={t.id} trip={t} onArchive={archive} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-4">Past</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
