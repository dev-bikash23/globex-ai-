import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTripDetail } from '../../features/trips/hooks/useTripDetail';
import { useItinerary } from '../../features/trips/hooks/useItinerary';
import { useBudget } from '../../features/trips/hooks/useBudget';
import { TripStatusBadge } from '../../features/trips/components/TripStatusBadge';
import { TravelerManager } from '../../features/trips/components/TravelerManager';
import { ItineraryTimeline } from '../../features/trips/components/ItineraryTimeline';
import { BudgetOverview } from '../../features/trips/components/BudgetOverview';
import { ExpenseList } from '../../features/trips/components/ExpenseList';
import { DeleteConfirmModal } from '../../features/trips/components/DeleteConfirmModal';
import { deleteTrip, removeFlight, removeHotel, removeActivity, updateTripStatus } from '../../features/trips/api/tripApi';

type Tab = 'overview' | 'itinerary' | 'budget' | 'ai';

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

export default function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [showDelete, setShowDelete] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { trip, flights, hotels, activities, travelers, loading, error, refresh } = useTripDetail(tripId!);
  const { itinerary, addItem, removeItem, moveItem, deleteDay, refresh: refreshItinerary } = useItinerary(tripId!);
  const { budget, expenses, addExpense, editExpense, removeExpense } = useBudget(tripId!);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400 animate-pulse">Loading trip…</p>
    </div>
  );
  if (error || !trip) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center"><p className="text-red-400 mb-4">{error ?? 'Trip not found'}</p><Link to="/trips" className="text-blue-400 hover:underline text-sm">← My Trips</Link></div>
    </div>
  );

  const handleArchive = async () => {
    await deleteTrip(tripId!, 'archive'); nav('/trips');
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(true);
    try { await updateTripStatus(tripId!, newStatus); await refresh(); }
    catch { /* ignore */ }
    finally { setStatusUpdating(false); }
  };

  const nextStatus: Record<string, string> = { PLANNING:'CONFIRMED', CONFIRMED:'IN_PROGRESS', IN_PROGRESS:'COMPLETED' };

  const TABS: { key: Tab; label: string }[] = [
    { key:'overview', label:'Overview' }, { key:'itinerary', label:'Itinerary' },
    { key:'budget', label:'Budget' }, { key:'ai', label:'🤖 AI (Phase 7)' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/trips" className="text-slate-400 hover:text-white text-sm shrink-0">← Trips</Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold truncate">{trip.title}</h1>
            <p className="text-slate-400 text-xs">{fmt(trip.startDate)} — {fmt(trip.endDate)} · {trip.durationDays} days</p>
          </div>
          <TripStatusBadge status={trip.status} />
          <Link to={`/trips/${tripId}/edit`} className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</Link>
          <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-red-800/40 text-slate-400 hover:text-red-400 rounded-lg">Archive</button>
        </div>
        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${tab === t.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — trip info + status + travelers */}
            <div className="lg:col-span-1 space-y-4">
              {trip.coverImageUrl && (
                <div className="h-40 rounded-xl overflow-hidden">
                  <img src={trip.coverImageUrl} alt={trip.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-2 text-sm">
                {trip.destination && <p className="text-slate-300">📍 {trip.destination.name}</p>}
                <p className="text-slate-400">📅 {fmt(trip.startDate)} – {fmt(trip.endDate)}</p>
                <p className="text-slate-400">💰 {trip.currency}{trip.budgetLimit ? ` · ${trip.budgetLimit.toLocaleString()} budget` : ''}</p>
                {trip.description && <p className="text-slate-400 text-xs pt-1 border-t border-slate-700/40">{trip.description}</p>}
              </div>

              {/* Status advance button */}
              {nextStatus[trip.status] && (
                <button onClick={() => handleStatusChange(nextStatus[trip.status])} disabled={statusUpdating}
                  className="w-full py-2 text-sm bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 rounded-xl transition-colors disabled:opacity-50">
                  {statusUpdating ? '…' : `→ Mark as ${nextStatus[trip.status].replace('_',' ')}`}
                </button>
              )}

              <TravelerManager tripId={tripId!} travelers={travelers} onRefresh={refresh} />
            </div>

            {/* Right — flights, hotels, activities */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flights */}
              <div>
                <h3 className="text-slate-300 font-medium text-sm mb-3">✈️ Flights ({flights.length})</h3>
                {flights.length === 0 ? (
                  <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-500 text-xs">Search and add flights from the <Link to="/search" className="text-blue-400 hover:underline">Search page</Link></p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {flights.map(f => (
                      <div key={f.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/40 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{f.origin} → {f.destination}</p>
                          <p className="text-xs text-slate-400">{f.airline ?? f.provider} · {f.cabinClass ?? ''}</p>
                          <p className="text-xs text-amber-400 italic">{f.statusNote}</p>
                        </div>
                        <p className="text-sm font-semibold text-blue-300">{f.currency} {f.priceAmount.toLocaleString()}</p>
                        <button onClick={() => removeFlight(tripId!, f.id).then(refresh)} className="text-xs text-slate-500 hover:text-red-400 px-1" aria-label="Remove flight">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hotels */}
              <div>
                <h3 className="text-slate-300 font-medium text-sm mb-3">🏨 Hotels ({hotels.length})</h3>
                {hotels.length === 0 ? (
                  <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-500 text-xs">Search and add hotels from the <Link to="/search" className="text-blue-400 hover:underline">Search page</Link></p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {hotels.map(h => (
                      <div key={h.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/40 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{h.hotelName}</p>
                          <p className="text-xs text-slate-400">{h.checkIn} → {h.checkOut} · {h.roomType ?? ''}</p>
                          <p className="text-xs text-amber-400 italic">{h.statusNote}</p>
                        </div>
                        <p className="text-sm font-semibold text-blue-300">{h.currency} {h.priceAmount.toLocaleString()}</p>
                        <button onClick={() => removeHotel(tripId!, h.id).then(refresh)} className="text-xs text-slate-500 hover:text-red-400 px-1" aria-label="Remove hotel">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activities */}
              <div>
                <h3 className="text-slate-300 font-medium text-sm mb-3">🎭 Activities ({activities.length})</h3>
                {activities.length === 0 ? (
                  <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-500 text-xs">Search and add activities from the <Link to="/search" className="text-blue-400 hover:underline">Search page</Link></p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activities.map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/40 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{a.activityName}</p>
                          <p className="text-xs text-slate-400">{a.activityDate ?? ''} {a.category ? `· ${a.category}` : ''}</p>
                        </div>
                        {a.priceAmount > 0 && <p className="text-sm font-semibold text-blue-300">{a.currency} {a.priceAmount.toLocaleString()}</p>}
                        <button onClick={() => removeActivity(tripId!, a.id).then(refresh)} className="text-xs text-slate-500 hover:text-red-400 px-1" aria-label="Remove activity">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {tab === 'itinerary' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-slate-200 font-semibold">Itinerary — {itinerary?.totalDays ?? 0} days</h2>
            </div>
            {itinerary && (
              <ItineraryTimeline
                days={itinerary.days}
                tripId={tripId!}
                onAddItem={addItem}
                onDeleteItem={removeItem}
                onDeleteDay={(dayId) => deleteDay(dayId).then(refreshItinerary)}
                onMoveItem={moveItem}
              />
            )}
          </div>
        )}

        {/* BUDGET TAB */}
        {tab === 'budget' && (
          <div className="space-y-8">
            {budget && <BudgetOverview budget={budget} />}
            {budget && (
              <ExpenseList
                expenses={expenses}
                onAdd={addExpense}
                onEdit={editExpense}
                onDelete={removeExpense}
                currency={trip.currency}
              />
            )}
          </div>
        )}

        {/* AI PLACEHOLDER TAB */}
        {tab === 'ai' && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-sm">
              <p className="text-5xl mb-4">🤖</p>
              <h2 className="text-xl font-semibold text-slate-200 mb-2">AI Travel Planner</h2>
              <p className="text-slate-400 text-sm">The AI-powered itinerary assistant is coming in Phase 7.</p>
              <p className="text-slate-500 text-xs mt-2">It will suggest daily schedules, optimize your budget, and find local gems based on your preferences.</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Phase 7 — Not implemented
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showDelete}
        title="Archive Trip"
        message={`Archive "${trip.title}"? It will be hidden from your trips list.`}
        confirmLabel="Archive"
        onConfirm={handleArchive}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
