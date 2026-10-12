import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getTrip, updateTrip } from '../../features/trips/api/tripApi';
import type { Trip, UpdateTripRequest } from '../../features/trips/types/trip.types';

const CURRENCIES = ['USD','EUR','GBP','INR','JPY','AUD','CAD','SGD','AED','THB'];

export default function EditTripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const nav = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tripId) return;
    getTrip(tripId).then(t => {
      setTrip(t); setTitle(t.title); setDescription(t.description ?? '');
      setStartDate(t.startDate); setEndDate(t.endDate); setCurrency(t.currency);
      setBudgetLimit(t.budgetLimit != null ? String(t.budgetLimit) : '');
    }).catch(() => setError('Failed to load trip')).finally(() => setLoading(false));
  }, [tripId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const req: UpdateTripRequest = { title: title.trim(), description: description || undefined, startDate, endDate, currency, budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined };
      await updateTrip(tripId!, req);
      nav(`/trips/${tripId}`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); setSaving(false); }
  }

  const inp = "w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500";

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-slate-400 animate-pulse">Loading…</p></div>;
  if (error && !trip) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-red-400">{error}</p></div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/trips/${tripId}`} className="text-slate-400 hover:text-white text-sm">← Back</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 text-sm">Edit Trip</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-6">Edit Trip</h1>
        <form onSubmit={handleSave} className="space-y-4 bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <div><label className="block text-xs text-slate-400 mb-1">Title *</label><input value={title} onChange={e => setTitle(e.target.value)} className={inp} required maxLength={200} /></div>
          <div><label className="block text-xs text-slate-400 mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inp} h-24 resize-none`} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-slate-400 mb-1">Start Date *</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inp} /></div>
            <div><label className="block text-xs text-slate-400 mb-1">End Date *</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className={inp} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-slate-400 mb-1">Currency</label><select value={currency} onChange={e => setCurrency(e.target.value)} className={inp}>{CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-xs text-slate-400 mb-1">Budget Limit</label><input type="number" min="0" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} className={inp} placeholder="Optional" /></div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Link to={`/trips/${tripId}`} className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">Cancel</Link>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
