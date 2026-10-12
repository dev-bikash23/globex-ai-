import { useState, useCallback, useRef } from 'react';
import { locationApi } from '../api/travelApi';
import type { LocationSuggestion } from '../types/phase5.types';

export function useLocationAutocomplete() {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await locationApi.search(query, 8);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => {
    setSuggestions([]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  return { suggestions, isLoading, search, clear };
}
