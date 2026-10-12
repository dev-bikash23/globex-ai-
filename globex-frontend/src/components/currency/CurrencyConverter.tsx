import { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { DataFreshness } from '../common/DataFreshness';
import { ExternalSourceBadge } from '../common/ExternalSourceBadge';

interface Props { defaultTarget?: string; }

export function CurrencyConverter({ defaultTarget = 'JPY' }: Props) {
  const { base, target, setBase, setTarget, rate, loading, error, swap, currencies } = useCurrency('USD', defaultTarget);
  const [amount, setAmount] = useState(100);

  const currencyKeys = Object.keys(currencies).sort();
  const converted = rate ? amount * rate.rate : 0;

  return (
    <div className="currency-converter">
      <h3 className="currency-converter__title">💱 Currency Converter</h3>

      <div className="currency-converter__row">
        <input
          type="number"
          className="currency-converter__input"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          min={0}
        />
        <select
          className="currency-converter__select"
          value={base}
          onChange={(e) => setBase(e.target.value)}
        >
          {currencyKeys.map(c => (
            <option key={c} value={c}>{c} — {currencies[c]}</option>
          ))}
        </select>
      </div>

      <button className="currency-converter__swap" onClick={swap} title="Swap currencies">⇅</button>

      <div className="currency-converter__row">
        <div className="currency-converter__result">
          {loading ? '...' : error ? 'N/A' : `≈ ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </div>
        <select
          className="currency-converter__select"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          {currencyKeys.map(c => (
            <option key={c} value={c}>{c} — {currencies[c]}</option>
          ))}
        </select>
      </div>

      {rate && (
        <div className="currency-converter__meta">
          <span className="currency-converter__rate">
            1 {rate.baseCurrency} = {rate.rate.toFixed(4)} {rate.targetCurrency}
          </span>
          <DataFreshness updatedAt={rate.date ?? rate.updatedAt} freshness="CACHED" />
          <ExternalSourceBadge text={rate.attribution} />
        </div>
      )}
    </div>
  );
}
