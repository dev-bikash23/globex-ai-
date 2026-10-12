import { useState, useEffect, useCallback } from 'react';
import type { CurrencyRateResponse } from '../types/phase4.types';
import { currencyApi } from '../api/currencyApi';

export function useCurrency(initialBase = 'USD', initialTarget = 'EUR') {
  const [base, setBase] = useState(initialBase);
  const [target, setTarget] = useState(initialTarget);
  const [rate, setRate] = useState<CurrencyRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Record<string, string>>({});

  useEffect(() => {
    currencyApi.getSupportedCurrencies()
      .then((data: Record<string, string>) => setCurrencies(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!base || !target) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    currencyApi.getRate(base, target)
      .then((data: CurrencyRateResponse) => { if (!cancelled) setRate(data); })
      .catch(() => { if (!cancelled) setError('Rate unavailable'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [base, target]);

  const swap = useCallback(() => {
    const oldBase = base;
    const oldTarget = target;
    setBase(oldTarget);
    setTarget(oldBase);
  }, [base, target]);

  return { base, target, setBase, setTarget, rate, loading, error, swap, currencies };
}
