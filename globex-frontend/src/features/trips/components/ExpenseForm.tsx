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

  const inputClass = "w-full border border-slate-200 bg-white text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className={inputClass}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>Currency</label>
          <input value={currency} onChange={e => setCurrency(e.target.value.toUpperCase().slice(0,3))} maxLength={3} className={inputClass} placeholder="USD" />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>Description *</label>
        <input value={description} onChange={e => setDescription(e.target.value)} className={inputClass} placeholder="What was this for?" required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>Amount *</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} placeholder="0.00" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>Date</label>
          <input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>Notes</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="Optional notes" />
      </div>
      {error && <p style={{ color: '#DC2626', fontSize: '0.75rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--color-slate)', background: 'var(--color-sand)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Cancel</button>
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'var(--color-navy)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
          {loading ? 'Saving…' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
