import type { BudgetSummary } from '../types/trip.types';
import { BudgetCategoryBar } from './BudgetCategoryBar';

interface Props { budget: BudgetSummary; }

function fmt(n: number, currency: string) {
  return `${currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BudgetOverview({ budget }: Props) {
  const cards = [
    { label: 'Planned Total', value: budget.plannedTotal, color: 'text-blue-400' },
    { label: 'Actual Spent', value: budget.actualTotal, color: 'text-amber-400' },
    ...(budget.budgetLimit != null ? [{ label: budget.isOverBudget ? '⚠ Over Budget' : 'Remaining', value: budget.remaining ?? 0, color: budget.isOverBudget ? 'text-red-400' : 'text-green-400' }] : []),
  ];

  const planBreakdown = [
    { label: '✈️ Flights', value: budget.plannedFlights },
    { label: '🏨 Hotels', value: budget.plannedHotels },
    { label: '🎭 Activities', value: budget.plannedActivities },
  ].filter(x => x.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{fmt(c.value, budget.currency)}</p>
          </div>
        ))}
      </div>

      {planBreakdown.length > 0 && (
        <div>
          <h4 className="text-slate-300 text-sm font-medium mb-3">Planned Breakdown</h4>
          <div className="space-y-2">
            {planBreakdown.map(b => (
              <div key={b.label} className="flex justify-between text-sm">
                <span className="text-slate-400">{b.label}</span>
                <span className="text-slate-200">{fmt(b.value, budget.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(budget.actualByCategory).length > 0 && (
        <div>
          <h4 className="text-slate-300 text-sm font-medium mb-3">Actual Expenses by Category</h4>
          <BudgetCategoryBar budget={budget} />
        </div>
      )}

      <p className="text-xs text-slate-500 italic">{budget.currencyNote}</p>
    </div>
  );
}
