import { useState, useEffect, useCallback } from 'react';
import { destinationApi } from '../../api/destinationApi';
import type { DestinationSummary } from '../../types/destination.types';

export function useDestinationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DestinationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      destinationApi.search(trimmed)
        .then(page => { if (!cancelled) setResults(page.content); })
        .catch(err => { if (!cancelled) setError(err.message); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300); // 300ms debounce

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return { query, setQuery, results, loading, error, clear };
}
