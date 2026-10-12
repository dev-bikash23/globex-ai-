interface Props {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  loading: boolean;
}

export function SearchBar({ value, onChange, onClear, loading }: Props) {
  return (
    <div className="search-bar" role="search">
      <span className="search-bar__icon" aria-hidden="true">🔍</span>
      <input
        type="search"
        className="search-bar__input"
        placeholder="Search countries, cities, destinations…"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search destinations"
        autoComplete="off"
        spellCheck={false}
      />
      {loading && (
        <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px', flexShrink: 0 }} />
      )}
      {value && !loading && (
        <button className="search-bar__clear" onClick={onClear} aria-label="Clear search">✕</button>
      )}
    </div>
  );
}
