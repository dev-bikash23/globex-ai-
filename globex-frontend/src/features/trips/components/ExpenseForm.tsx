import { useState } from 'react';
import type { CreateExpenseRequest, ExpenseCategory } from '../types/trip.types';

const CATEGORIES: ExpenseCategory[] = ['FLIGHT','HOTEL','ACTIVITY','FOOD','TRANSPORT','SHOPPING','MISCELLANEOUS'];

interface Props {
  onSubmit: (req: CreateExpenseRequest) => Promise<void>;
  onCancel: () => void;
  initial?: Partial<CreateExpenseRequest>;
}

export function ExpenseForm({ onSubmit, onCancel, initial }: Props) {
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? 'MISCELLANEOUS');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [amount, setAmount] = useState(String(initial?.amount ?? ''));
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD');
  const [expenseDate, setExpenseDate] = useState(initial?.expenseDate ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || !amount) { setError('Description and amount are required'); return; }
    setLoading(true); setError('');
    try {
      await onSubmit({ category, description: description.trim(), amount: parseFloat(amount), currency, expenseDate: expenseDate || undefined, notes: notes || undefined });
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save expense'); }
    finally { setLoading(false); }
  }

  const inputClass = "w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className={inputClass}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Currency</label>
          <input value={currency} onChange={e => setCurrency(e.target.value.toUpperCase().slice(0,3))} maxLength={3} className={inputClass} placeholder="USD" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description *</label>
        <input value={description} onChange={e => setDescription(e.target.value)} className={inputClass} placeholder="What was this for?" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Amount *</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} placeholder="0.00" required />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Date</label>
          <input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Notes</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="Optional notes" />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
