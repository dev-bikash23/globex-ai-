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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-slate-300 font-medium text-sm">Expenses ({expenses.length})</h4>
        <button onClick={() => setShowForm(true)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">+ Add Expense</button>
      </div>

      {showForm && !editing && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <ExpenseForm onSubmit={async req => { await onAdd(req); setShowForm(false); }} onCancel={() => setShowForm(false)} initial={{ currency }} />
        </div>
      )}

      {expenses.length === 0 && !showForm && (
        <p className="text-slate-500 text-sm text-center py-6">No expenses tracked yet. Add your first expense.</p>
      )}

      <div className="space-y-2">
        {expenses.map(exp => (
          <div key={exp.id}>
            {editing?.id === exp.id ? (
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                <ExpenseForm
                  initial={{ category: exp.category, description: exp.description, amount: exp.amount, currency: exp.currency, expenseDate: exp.expenseDate, notes: exp.notes }}
                  onSubmit={async req => { await onEdit(exp.id, req); setEditing(null); }}
                  onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2 px-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-colors">
                <span className="text-lg">{CAT_EMOJI[exp.category] ?? '📋'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{exp.description}</p>
                  <p className="text-xs text-slate-400">{exp.category}{exp.expenseDate ? ` · ${exp.expenseDate}` : ''}</p>
                </div>
                <p className="text-sm font-semibold text-slate-200 shrink-0">{exp.currency} {exp.amount.toLocaleString()}</p>
                <button onClick={() => setEditing(exp)} className="text-xs text-slate-500 hover:text-blue-400 px-1">Edit</button>
                <button onClick={() => setDeleting(exp.id)} className="text-xs text-slate-500 hover:text-red-400 px-1">Del</button>
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
