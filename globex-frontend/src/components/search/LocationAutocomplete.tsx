import { useState, useRef, useEffect } from 'react';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';
import type { LocationSuggestion } from '../../types/phase5.types';

interface Props {
  value: string;
  placeholder: string;
  label: string;
  onChange: (code: string, suggestion: LocationSuggestion) => void;
  id: string;
}

export default function LocationAutocomplete({ value, placeholder, label, onChange, id }: Props) {
  const [inputVal, setInputVal] = useState(value);
  const [open, setOpen] = useState(false);
  const { suggestions, isLoading, search, clear } = useLocationAutocomplete();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    search(val);
    setOpen(true);
  };

  const handleSelect = (s: LocationSuggestion) => {
    setInputVal(`${s.iataCode} - ${s.cityName}`);
    onChange(s.iataCode, s);
    setOpen(false);
    clear();
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={inputVal}
          onChange={handleInput}
          onFocus={() => inputVal.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500
                     focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all duration-200
                     text-sm font-medium"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden
                        border border-white/10 shadow-2xl shadow-black/60"
             style={{ background: 'rgba(10,18,35,0.98)', backdropFilter: 'blur(20px)' }}>
          {suggestions.map((s) => (
            <button
              key={s.iataCode}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/8
                         transition-colors duration-150 text-left group"
            >
              <span className="text-blue-400 font-bold text-sm w-10 shrink-0">{s.iataCode}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {s.cityName}, {s.countryName}
                </div>
                <div className="text-slate-500 text-xs truncate">{s.name}</div>
              </div>
              <span className="text-slate-600 text-xs">✈</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
