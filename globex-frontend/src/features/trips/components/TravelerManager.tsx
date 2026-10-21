import { useState } from 'react';
import type { TripTraveler, AddTravelerRequest, TravelerType } from '../types/trip.types';
import { addTraveler, removeTraveler } from '../api/tripApi';

const EMOJI: Record<TravelerType, string> = { ADULT: '🧑', CHILD: '🧒', INFANT: '👶' };

export function TravelerManager({ tripId, travelers, onRefresh }: { tripId: string; travelers: TripTraveler[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [type, setType] = useState<TravelerType>('ADULT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await addTraveler(tripId, { firstName: firstName || undefined, lastName: lastName || undefined, travelerType: type } as AddTravelerRequest);
      setFirstName(''); setLastName(''); setShowForm(false); onRefresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  }

  async function handleRemove(travelerId: string) {
    await removeTraveler(tripId, travelerId); onRefresh();
  }

  const inp = "w-full border border-slate-200 text-slate-800 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.875rem' }}>Travelers ({travelers.length})</h4>
        <button onClick={() => setShowForm(s => !s)} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', background: 'var(--color-navy)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>+ Add Traveler</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>First Name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} className={inp} placeholder="Optional" /></div>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Last Name</label><input value={lastName} onChange={e => setLastName(e.target.value)} className={inp} placeholder="Optional" /></div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Type</label>
            <select value={type} onChange={e => setType(e.target.value as TravelerType)} className={inp}>
              {(['ADULT','CHILD','INFANT'] as TravelerType[]).map(t => <option key={t} value={t}>{EMOJI[t]} {t}</option>)}
            </select>
          </div>
          {error && <p style={{ color: '#DC2626', fontSize: '0.75rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-slate)', background: 'var(--color-sand)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', background: 'var(--color-navy)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Adding…' : 'Add'}</button>
          </div>
        </form>
      )}

      {travelers.length === 0 && !showForm && <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>No travelers yet.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {travelers.map(tv => (
          <div key={tv.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '1.125rem' }}>{EMOJI[tv.travelerType]}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-navy)', flex: 1 }}>{[tv.firstName, tv.lastName].filter(Boolean).join(' ') || <span style={{ color: 'var(--color-slate)', fontStyle: 'italic' }}>Unnamed</span>}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{tv.travelerType}</span>
            <button onClick={() => handleRemove(tv.id)} style={{ fontSize: '0.75rem', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.25rem' }} aria-label="Remove traveler">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
