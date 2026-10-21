import type { BudgetSummary } from '../types/trip.types';
import { BudgetCategoryBar } from './BudgetCategoryBar';

interface Props { budget: BudgetSummary; }

function fmt(n: number, currency: string) {
  return `${currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BudgetOverview({ budget }: Props) {
  const cards = [
    { label: 'Planned Total', value: budget.plannedTotal, color: 'var(--color-ocean)' },
    { label: 'Actual Spent', value: budget.actualTotal, color: '#D97706' },
    ...(budget.budgetLimit != null ? [{ label: budget.isOverBudget ? '⚠ Over Budget' : 'Remaining', value: budget.remaining ?? 0, color: budget.isOverBudget ? '#DC2626' : '#16A34A' }] : []),
  ];

  const planBreakdown = [
    { label: '✈️ Flights', value: budget.plannedFlights },
    { label: '🏨 Hotels', value: budget.plannedHotels },
    { label: '🎭 Activities', value: budget.plannedActivities },
  ].filter(x => x.value > 0);

  const cardStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {cards.map(c => (
          <div key={c.label} style={cardStyle}>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{c.label}</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: c.color }}>{fmt(c.value, budget.currency)}</p>
          </div>
        ))}
      </div>

      {planBreakdown.length > 0 && (
        <div>
          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Planned Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {planBreakdown.map(b => (
              <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-slate)' }}>{b.label}</span>
                <span style={{ color: 'var(--color-navy)', fontWeight: 600 }}>{fmt(b.value, budget.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(budget.actualByCategory).length > 0 && (
        <div>
          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Actual Expenses by Category</h4>
          <BudgetCategoryBar budget={budget} />
        </div>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontStyle: 'italic' }}>{budget.currencyNote}</p>
    </div>
  );
}
