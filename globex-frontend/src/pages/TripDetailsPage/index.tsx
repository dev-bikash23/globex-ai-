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
import Navbar from '../../components/layout/Navbar';

type Tab = 'overview' | 'itinerary' | 'budget' | 'ai';

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview',   label: 'Overview' },
  { key: 'itinerary',  label: 'Itinerary' },
  { key: 'budget',     label: 'Budget' },
  { key: 'ai',         label: '🤖 AI (Phase 7)' },
];

/** Reusable section card */
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
    <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>{title}</h3>
    {children}
  </div>
);

/** Empty booking slot */
const EmptySlot = ({ label, to }: { label: string; to: string }) => (
  <div style={{ border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
    <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
      Search and add {label} from the{' '}
      <Link to={to} style={{ color: 'var(--color-ocean)', fontWeight: 500 }}>Search page</Link>
    </p>
  </div>
);

/** Booking row */
const BookingRow = ({ left, right, onRemove }: { left: React.ReactNode; right?: React.ReactNode; onRemove: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
    <div style={{ flex: 1, minWidth: 0 }}>{left}</div>
    {right}
    <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '0.25rem', fontSize: '0.9rem', flexShrink: 0 }} aria-label="Remove">✕</button>
  </div>
);

export default function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [showDelete, setShowDelete] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { trip, flights, hotels, activities, travelers, loading, error, refresh } = useTripDetail(tripId!);
  const { itinerary, addItem, removeItem, moveItem, removeDay, refresh: refreshItinerary } = useItinerary(tripId!);
  const { budget, expenses, addExpense, editExpense, removeExpense } = useBudget(tripId!);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
          <p style={{ color: 'var(--color-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Loading trip…</p>
        </div>
      </div>
    </div>
  );

  if (error || !trip) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error ?? 'Trip not found'}</p>
          <Link to="/trips" className="btn btn-outline">← My Trips</Link>
        </div>
      </div>
    </div>
  );

  const handleArchive = async () => { await deleteTrip(tripId!, 'archive'); nav('/trips'); };
  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(true);
    try { await updateTripStatus(tripId!, newStatus); await refresh(); }
    catch { /* ignore */ }
    finally { setStatusUpdating(false); }
  };
  const nextStatus: Record<string, string> = { PLANNING: 'CONFIRMED', CONFIRMED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* ── Trip Header ────────────────────────────────────────── */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-ocean) 100%)', color: '#fff', padding: '2rem 0 0' }}>
          <div className="gx-container">
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
              <Link to="/trips" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>My Trips</Link>
              <span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>{trip.title}</span>
            </nav>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600 }}>{trip.title}</h1>
                  <TripStatusBadge status={trip.status} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {fmt(trip.startDate)} — {fmt(trip.endDate)} · {trip.durationDays} days
                  {trip.destination && <span> · 📍 {trip.destination.name}</span>}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to={`/trips/${tripId}/edit`} className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Edit</Link>
                <button onClick={() => setShowDelete(true)} className="btn btn-sm" style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#fca5a5', cursor: 'pointer' }}>Archive</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0' }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === t.key ? '2.5px solid var(--color-teal-light)' : '2.5px solid transparent',
                    color: tab === t.key ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'color 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Content ─────────────────────────────────────────── */}
        <div className="gx-container" style={{ padding: '2rem 1.5rem 4rem' }}>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              {/* Left column */}
              <div>
                {trip.coverImageUrl && (
                  <div style={{ height: 160, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem' }}>
                    <img src={trip.coverImageUrl} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <SectionCard title="Trip Details">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                    {trip.destination && <p style={{ color: 'var(--color-navy)' }}>📍 {trip.destination.name}</p>}
                    <p style={{ color: 'var(--color-slate)' }}>📅 {fmt(trip.startDate)} – {fmt(trip.endDate)}</p>
                    <p style={{ color: 'var(--color-slate)' }}>💰 {trip.currency}{trip.budgetLimit ? ` · ${trip.budgetLimit.toLocaleString()} budget` : ''}</p>
                    {trip.description && <p style={{ color: 'var(--color-muted)', fontSize: '0.8125rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>{trip.description}</p>}
                  </div>
                </SectionCard>

                {nextStatus[trip.status] && (
                  <button onClick={() => handleStatusChange(nextStatus[trip.status])} disabled={statusUpdating}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: 'rgba(45,143,94,0.06)', border: '1px solid rgba(45,143,94,0.2)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, marginBottom: '1rem', opacity: statusUpdating ? 0.5 : 1 }}>
                    {statusUpdating ? '…' : `→ Mark as ${nextStatus[trip.status].replace('_', ' ')}`}
                  </button>
                )}

                <TravelerManager tripId={tripId!} travelers={travelers} onRefresh={refresh} />
              </div>

              {/* Right column — bookings */}
              <div>
                <SectionCard title={`✈️ Flights (${flights.length})`}>
                  {flights.length === 0 ? <EmptySlot label="flights" to="/search" /> : flights.map(f => (
                    <BookingRow key={f.id}
                      left={<>
                        <p style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9rem' }}>{f.origin} → {f.destination}</p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{f.airline ?? f.provider} · {f.cabinClass ?? ''}</p>
                        {f.statusNote && <p style={{ color: 'var(--color-warning)', fontSize: '0.75rem', fontStyle: 'italic' }}>{f.statusNote}</p>}
                      </>}
                      right={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ocean)', flexShrink: 0 }}>{f.currency} {f.priceAmount.toLocaleString()}</span>}
                      onRemove={() => removeFlight(tripId!, f.id).then(refresh)}
                    />
                  ))}
                </SectionCard>

                <SectionCard title={`🏨 Hotels (${hotels.length})`}>
                  {hotels.length === 0 ? <EmptySlot label="hotels" to="/search" /> : hotels.map(h => (
                    <BookingRow key={h.id}
                      left={<>
                        <p style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9rem' }}>{h.hotelName}</p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{h.checkIn} → {h.checkOut} · {h.roomType ?? ''}</p>
                        {h.statusNote && <p style={{ color: 'var(--color-warning)', fontSize: '0.75rem', fontStyle: 'italic' }}>{h.statusNote}</p>}
                      </>}
                      right={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ocean)', flexShrink: 0 }}>{h.currency} {h.priceAmount.toLocaleString()}</span>}
                      onRemove={() => removeHotel(tripId!, h.id).then(refresh)}
                    />
                  ))}
                </SectionCard>

                <SectionCard title={`🎭 Activities (${activities.length})`}>
                  {activities.length === 0 ? <EmptySlot label="activities" to="/search" /> : activities.map(a => (
                    <BookingRow key={a.id}
                      left={<>
                        <p style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9rem' }}>{a.activityName}</p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{a.activityDate ?? ''}{a.category ? ` · ${a.category}` : ''}</p>
                      </>}
                      right={a.priceAmount > 0 ? <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ocean)', flexShrink: 0 }}>{a.currency} {a.priceAmount.toLocaleString()}</span> : undefined}
                      onRemove={() => removeActivity(tripId!, a.id).then(refresh)}
                    />
                  ))}
                </SectionCard>
              </div>
            </div>
          )}

          {/* ITINERARY TAB */}
          {tab === 'itinerary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                  Itinerary — {itinerary?.totalDays ?? 0} days
                </h2>
              </div>
              {itinerary && (
                <ItineraryTimeline
                  days={itinerary.days}
                  tripId={tripId!}
                  onAddItem={addItem}
                  onDeleteItem={removeItem}
                  onDeleteDay={(dayId) => removeDay(dayId).then(refreshItinerary)}
                  onMoveItem={moveItem}
                />
              )}
            </div>
          )}

          {/* BUDGET TAB */}
          {tab === 'budget' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {budget && <BudgetOverview budget={budget} />}
              {budget && (
                <ExpenseList expenses={expenses} onAdd={addExpense} onEdit={editExpense} onDelete={removeExpense} currency={trip.currency} />
              )}
            </div>
          )}

          {/* AI PLACEHOLDER */}
          {tab === 'ai' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
              <div style={{ textAlign: 'center', maxWidth: 400 }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🤖</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                  AI Travel Planner
                </h2>
                <p style={{ color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  The AI-powered itinerary assistant is coming in Phase 7. It will suggest daily schedules, optimize your budget, and find local gems.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 'var(--radius-full)', color: 'var(--color-warning)', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-warning)', display: 'inline-block' }} />
                  Phase 7 — Coming Soon
                </div>
              </div>
            </div>
          )}
        </div>
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
