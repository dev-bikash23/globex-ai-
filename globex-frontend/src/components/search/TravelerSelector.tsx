import { useState, useRef, useEffect } from 'react';

interface Props {
  adults: number;
  children: number;
  infants: number;
  onChange: (adults: number, children: number, infants: number) => void;
}

export default function TravelerSelector({ adults, children, infants, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const total = adults + children + infants;

  const Counter = ({
    label, sublabel, value, min, max, onInc, onDec
  }: {
    label: string; sublabel: string; value: number;
    min: number; max: number; onInc: () => void; onDec: () => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        <div className="text-slate-500 text-xs">{sublabel}</div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onDec} disabled={value <= min}
          className="w-8 h-8 rounded-full border border-white/20 text-slate-300
                     hover:border-blue-400 hover:text-blue-400 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all flex items-center justify-center text-lg font-light">
          −
        </button>
        <span className="text-white font-semibold w-5 text-center">{value}</span>
        <button type="button" onClick={onInc} disabled={value >= max}
          className="w-8 h-8 rounded-full border border-white/20 text-slate-300
                     hover:border-blue-400 hover:text-blue-400 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all flex items-center justify-center text-lg font-light">
          +
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative w-full">
      <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
        Travelers
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left
                   text-white text-sm font-medium hover:bg-white/8 hover:border-white/20
                   focus:outline-none focus:border-blue-500/60 transition-all duration-200"
      >
        <span className="text-white">{total} Traveler{total !== 1 ? 's' : ''}</span>
        <span className="ml-2 text-slate-500 text-xs">
          {adults}A{children > 0 ? ` · ${children}C` : ''}{infants > 0 ? ` · ${infants}I` : ''}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 w-72 mt-1 rounded-xl p-4 border border-white/10 shadow-2xl"
             style={{ background: 'rgba(10,18,35,0.98)', backdropFilter: 'blur(20px)' }}>
          <Counter label="Adults" sublabel="Age 12+" value={adults} min={1} max={9}
            onInc={() => onChange(Math.min(adults + 1, 9), children, infants)}
            onDec={() => onChange(Math.max(adults - 1, 1), children, infants)} />
          <Counter label="Children" sublabel="Ages 2–11" value={children} min={0} max={8}
            onInc={() => onChange(adults, Math.min(children + 1, 8), infants)}
            onDec={() => onChange(adults, Math.max(children - 1, 0), infants)} />
          <Counter label="Infants" sublabel="Under 2" value={infants} min={0} max={4}
            onInc={() => onChange(adults, children, Math.min(infants + 1, 4))}
            onDec={() => onChange(adults, children, Math.max(infants - 1, 0))} />
          <button type="button" onClick={() => setOpen(false)}
            className="mt-3 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            Done
          </button>
        </div>
      )}
    </div>
  );
}
