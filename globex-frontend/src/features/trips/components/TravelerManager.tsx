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

  const inp = "w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-slate-300 font-medium text-sm">Travelers ({travelers.length})</h4>
        <button onClick={() => setShowForm(s => !s)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg">+ Add Traveler</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400">First Name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} className={inp} placeholder="Optional" /></div>
            <div><label className="text-xs text-slate-400">Last Name</label><input value={lastName} onChange={e => setLastName(e.target.value)} className={inp} placeholder="Optional" /></div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Type</label>
            <select value={type} onChange={e => setType(e.target.value as TravelerType)} className={inp}>
              {(['ADULT','CHILD','INFANT'] as TravelerType[]).map(t => <option key={t} value={t}>{EMOJI[t]} {t}</option>)}
            </select>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">{loading ? 'Adding…' : 'Add'}</button>
          </div>
        </form>
      )}

      {travelers.length === 0 && !showForm && <p className="text-slate-500 text-sm text-center py-4">No travelers yet.</p>}

      <div className="space-y-2">
        {travelers.map(tv => (
          <div key={tv.id} className="flex items-center gap-3 py-2 px-3 bg-slate-800/40 rounded-lg">
            <span className="text-lg">{EMOJI[tv.travelerType]}</span>
            <span className="text-sm text-white flex-1">{[tv.firstName, tv.lastName].filter(Boolean).join(' ') || <span className="text-slate-500 italic">Unnamed</span>}</span>
            <span className="text-xs text-slate-500">{tv.travelerType}</span>
            <button onClick={() => handleRemove(tv.id)} className="text-xs text-slate-500 hover:text-red-400 px-1 transition-colors" aria-label="Remove traveler">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
