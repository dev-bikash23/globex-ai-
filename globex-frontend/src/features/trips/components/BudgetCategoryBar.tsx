import type { BudgetSummary } from '../types/trip.types';

const CAT_COLORS: Record<string, string> = {
  FLIGHT:'bg-blue-500', HOTEL:'bg-purple-500', ACTIVITY:'bg-teal-500',
  FOOD:'bg-amber-500', TRANSPORT:'bg-orange-500', SHOPPING:'bg-pink-500', MISCELLANEOUS:'bg-slate-500',
};

export function BudgetCategoryBar({ budget }: { budget: BudgetSummary }) {
  const total = Object.values(budget.actualByCategory).reduce((a, b) => a + b, 0);
  if (total === 0) return <p className="text-slate-500 text-sm">No expenses yet.</p>;
  return (
    <div className="space-y-3">
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        {Object.entries(budget.actualByCategory).map(([cat, amt]) => (
          <div key={cat} style={{ width: `${(amt/total)*100}%` }}
            className={`${CAT_COLORS[cat] ?? 'bg-slate-500'} transition-all`} title={`${cat}: ${amt}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(budget.actualByCategory).map(([cat, amt]) => (
          <div key={cat} className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CAT_COLORS[cat] ?? 'bg-slate-500'}`} />
            <span className="text-slate-400 truncate">{cat}</span>
            <span className="text-slate-300 ml-auto">{budget.currency} {amt.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
