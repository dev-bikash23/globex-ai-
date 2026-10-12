import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/tripApi';
import type { BudgetSummary, TripExpense, CreateExpenseRequest } from '../types/trip.types';

export function useBudget(tripId: string) {
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const [b, e] = await Promise.all([api.getBudget(tripId), api.getExpenses(tripId)]);
      setBudget(b); setExpenses(e);
    } finally { setLoading(false); }
  }, [tripId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const addExpense = useCallback(async (req: CreateExpenseRequest) => {
    await api.addExpense(tripId, req); void refresh();
  }, [tripId, refresh]);

  const editExpense = useCallback(async (expId: string, req: CreateExpenseRequest) => {
    await api.updateExpense(tripId, expId, req); void refresh();
  }, [tripId, refresh]);

  const removeExpense = useCallback(async (expId: string) => {
    await api.deleteExpense(tripId, expId); void refresh();
  }, [tripId, refresh]);

  return { budget, expenses, loading, refresh, addExpense, editExpense, removeExpense };
}
