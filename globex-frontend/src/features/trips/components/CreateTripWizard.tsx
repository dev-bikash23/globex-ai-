import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api/tripApi';
import type { CreateTripRequest } from '../types/trip.types';

const CURRENCIES = ['USD','EUR','GBP','INR','JPY','AUD','CAD','SGD','AED','THB'];
const STEP_LABELS = ['Destination','Title','Dates','Travelers','Currency','Review'];

interface WizardState {
  destinationId: string;
  destinationName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  currency: string;
  budgetLimit: string;
}

export function CreateTripWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({ destinationId:'', destinationName:'', title:'', description:'', startDate:'', endDate:'', currency:'USD', budgetLimit:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();
  const set = (k: keyof WizardState, v: string) => setState(p => ({ ...p, [k]: v }));

  function canNext(): boolean {
    if (step === 1 && !state.title.trim()) return false;
    if (step === 2 && (!state.startDate || !state.endDate || state.endDate < state.startDate)) return false;
    return true;
  }

  async function create() {
    setLoading(true); setError('');
    try {
      const req: CreateTripRequest = { title: state.title.trim(), description: state.description || undefined, startDate: state.startDate, endDate: state.endDate, currency: state.currency, destinationId: state.destinationId || undefined, budgetLimit: state.budgetLimit ? parseFloat(state.budgetLimit) : undefined };
      const trip = await createTrip(req);
      nav(`/trips/${trip.id}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create trip'); setLoading(false); }
  }

  const inp = "w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500";

  const steps = [
    // Step 0: Destination (optional — user can skip)
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">Select a destination for your trip (optional — you can set it later).</p>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Destination Name</label>
        <input value={state.destinationName} onChange={e => set('destinationName', e.target.value)} className={inp} placeholder="e.g. Tokyo, Japan" />
        <p className="text-xs text-slate-500 mt-1">Full destination search coming in a future update.</p>
      </div>
    </div>,

    // Step 1: Title
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Trip Title *</label>
        <input value={state.title} onChange={e => set('title', e.target.value)} className={inp} placeholder="e.g. Tokyo Adventure 2026" maxLength={200} required />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea value={state.description} onChange={e => set('description', e.target.value)} className={`${inp} h-24 resize-none`} placeholder="What's this trip about?" maxLength={2000} />
      </div>
    </div>,

    // Step 2: Dates
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Departure Date *</label>
        <input type="date" value={state.startDate} onChange={e => set('startDate', e.target.value)} className={inp} />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Return Date *</label>
        <input type="date" value={state.endDate} onChange={e => set('endDate', e.target.value)} min={state.startDate} className={inp} />
      </div>
      {state.startDate && state.endDate && state.endDate >= state.startDate && (
        <p className="text-blue-400 text-xs">📅 {Math.round((new Date(state.endDate).getTime() - new Date(state.startDate).getTime()) / 86400000) + 1} days</p>
      )}
    </div>,

    // Step 3: Travelers (just advisory — actual traveler records added after creation)
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">Traveler details can be added after creating the trip. This step is informational.</p>
      <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
        <p className="text-slate-300 text-sm">After creating your trip, go to the <strong>Overview</strong> tab to add travelers individually.</p>
        <p className="text-slate-400 text-xs">Supported: Adults, Children, Infants</p>
      </div>
    </div>,

    // Step 4: Currency + Budget
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Trip Currency *</label>
        <select value={state.currency} onChange={e => set('currency', e.target.value)} className={inp}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Budget Limit (optional)</label>
        <input type="number" min="0" step="100" value={state.budgetLimit} onChange={e => set('budgetLimit', e.target.value)} className={inp} placeholder="e.g. 50000" />
        <p className="text-xs text-slate-500 mt-1">Set a total budget cap to track spending against.</p>
      </div>
    </div>,

    // Step 5: Review
    <div className="space-y-3">
      {[
        ['Destination', state.destinationName || '—'],
        ['Title', state.title],
        ['Dates', state.startDate && state.endDate ? `${state.startDate} → ${state.endDate}` : '—'],
        ['Currency', state.currency],
        ['Budget Limit', state.budgetLimit ? `${state.currency} ${state.budgetLimit}` : 'Not set'],
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between text-sm py-2 border-b border-slate-700/40 last:border-0">
          <span className="text-slate-400">{k}</span>
          <span className="text-white font-medium text-right max-w-xs truncate">{v}</span>
        </div>
      ))}
    </div>,
  ];

  return (
    <div className="max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEP_LABELS.map((lbl, i) => (
          <div key={lbl} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-500 text-white ring-2 ring-blue-400/40' : 'bg-slate-700 text-slate-400'}`}>{i < step ? '✓' : i+1}</div>
            {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-blue-600' : 'bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">{STEP_LABELS[step]}</h2>
        {steps[step]}
      </div>

      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

      <div className="flex justify-between">
        <button onClick={() => setStep(s => s-1)} disabled={step === 0} className="px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30">← Back</button>
        {step < STEP_LABELS.length - 1
          ? <button onClick={() => setStep(s => s+1)} disabled={!canNext()} className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-40">Next →</button>
          : <button onClick={create} disabled={loading} className="px-6 py-2.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Creating…' : '✈️ Create Trip'}</button>
        }
      </div>
    </div>
  );
}
