import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getTrip, updateTrip } from '../../features/trips/api/tripApi';
import type { Trip, UpdateTripRequest } from '../../features/trips/types/trip.types';
import Navbar from '../../components/layout/Navbar';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'THB'];

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-surface)',
  border: '1.5px solid var(--color-border-strong)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9375rem',
  padding: '0.75rem 1rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  colorScheme: 'light',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--color-slate)',
  marginBottom: '0.4rem',
};

export default function EditTripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const nav = useNavigate();
  const [trip, setTrip]             = useState<Trip | null>(null);
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');
  const [currency, setCurrency]     = useState('USD');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!tripId) return;
    getTrip(tripId).then(t => {
      setTrip(t);
      setTitle(t.title);
      setDescription(t.description ?? '');
      setStartDate(t.startDate);
      setEndDate(t.endDate);
      setCurrency(t.currency);
      setBudgetLimit(t.budgetLimit != null ? String(t.budgetLimit) : '');
    }).catch(() => setError('Failed to load trip')).finally(() => setLoading(false));
  }, [tripId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const req: UpdateTripRequest = {
        title: title.trim(),
        description: description || undefined,
        startDate,
        endDate,
        currency,
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined,
      };
      await updateTrip(tripId!, req);
      nav(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
      </div>
    </div>
  );

  if (error && !trip) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--color-danger)' }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        {/* ── Sub-header ─────────────────────────────────────────── */}
        <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
          <div className="gx-container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              <Link to="/trips" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>My Trips</Link>
              <span>›</span>
              <Link to={`/trips/${tripId}`} style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>{trip?.title ?? 'Trip'}</Link>
              <span>›</span>
              <span style={{ color: 'var(--color-navy)', fontWeight: 500 }}>Edit</span>
            </nav>
          </div>
        </div>

        {/* ── Form ────────────────────────────────────────────────── */}
        <div className="gx-container" style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: 680 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '2rem' }}>
            Edit Trip
          </h1>

          <form onSubmit={handleSave}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label style={labelStyle}>Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} style={fieldStyle} required maxLength={200} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  style={{ ...fieldStyle, height: 96, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Start Date *</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>End Date *</label>
                  <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} style={fieldStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Budget Limit</label>
                  <input type="number" min="0" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} style={fieldStyle} placeholder="Optional" />
                </div>
              </div>

              {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <Link to={`/trips/${tripId}`} className="btn btn-outline btn-sm">Cancel</Link>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="spinner" style={{ width: '0.875rem', height: '0.875rem', borderWidth: '2px' }} /> Saving…
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
