import type { CurrencyRateResponse } from '../types/phase4.types';

export const currencyApi = {
  async getRate(base: string, target: string): Promise<CurrencyRateResponse> {
    const res = await fetch(`/api/v1/currency/rates?base=${encodeURIComponent(base)}&target=${encodeURIComponent(target)}`);
    if (!res.ok) throw new Error(`Currency fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as CurrencyRateResponse;
  },

  async getSupportedCurrencies(): Promise<Record<string, string>> {
    const res = await fetch('/api/v1/currency/currencies');
    if (!res.ok) throw new Error(`Currencies fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as Record<string, string>;
  },
};
