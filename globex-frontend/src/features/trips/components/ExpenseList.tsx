import { useState } from 'react';
import type { TripExpense, CreateExpenseRequest } from '../types/trip.types';
import { ExpenseForm } from './ExpenseForm';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface Props {
  expenses: TripExpense[];
  onAdd: (req: CreateExpenseRequest) => Promise<void>;
  onEdit: (id: string, req: CreateExpenseRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  currency: string;
}

const CAT_EMOJI: Record<string, string> = {
  FLIGHT:'✈️', HOTEL:'🏨', ACTIVITY:'🎭', FOOD:'🍜', TRANSPORT:'🚌', SHOPPING:'🛍️', MISCELLANEOUS:'📋'
};

export function ExpenseList({ expenses, onAdd, onEdit, onDelete, currency }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TripExpense | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.875rem' }}>Expenses ({expenses.length})</h4>
        <button onClick={() => setShowForm(true)} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', background: 'var(--color-navy)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>+ Add Expense</button>
      </div>

      {showForm && !editing && (
        <div style={{ background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
          <ExpenseForm onSubmit={async req => { await onAdd(req); setShowForm(false); }} onCancel={() => setShowForm(false)} initial={{ currency }} />
        </div>
      )}

      {expenses.length === 0 && !showForm && (
        <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No expenses tracked yet. Add your first expense.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {expenses.map(exp => (
          <div key={exp.id}>
            {editing?.id === exp.id ? (
              <div style={{ background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <ExpenseForm
                  initial={{ category: exp.category, description: exp.description, amount: exp.amount, currency: exp.currency, expenseDate: exp.expenseDate, notes: exp.notes }}
                  onSubmit={async req => { await onEdit(exp.id, req); setEditing(null); }}
                  onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'border-color 0.2s' }}>
                <span style={{ fontSize: '1.125rem' }}>{CAT_EMOJI[exp.category] ?? '📋'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.description}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{exp.category}{exp.expenseDate ? ` · ${exp.expenseDate}` : ''}</p>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', flexShrink: 0 }}>{exp.currency} {exp.amount.toLocaleString()}</p>
                <button onClick={() => setEditing(exp)} style={{ fontSize: '0.75rem', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.25rem' }}>Edit</button>
                <button onClick={() => setDeleting(exp.id)} style={{ fontSize: '0.75rem', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.25rem' }}>Del</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <DeleteConfirmModal isOpen={!!deleting} title="Delete Expense" message="Remove this expense record?"
        onConfirm={async () => { if (deleting) { await onDelete(deleting); setDeleting(null); } }}
        onCancel={() => setDeleting(null)} />
    </div>
  );
}
