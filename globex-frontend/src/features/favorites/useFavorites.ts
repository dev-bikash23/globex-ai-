import { useState, useEffect, useCallback } from 'react';
import { favoriteApi } from '../../api/favoriteApi';
import type { FavoriteResponse } from '../../types/destination.types';
import { useAuth } from '../../auth/AuthProvider';

export function useFavorites() {
  const { state } = useAuth();
  const isAuthenticated = state.status === 'authenticated';

  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load favorites when user logs in
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoritedIds(new Set());
      return;
    }

    let cancelled = false;
    setLoading(true);
    favoriteApi.getMyFavorites()
      .then(data => {
        if (!cancelled) {
          setFavorites(data);
          setFavoritedIds(new Set(data.map(f => f.destinationId)));
        }
      })
      .catch(() => { /* Fail silently — user can retry */ })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (destinationId: string) => {
    if (!isAuthenticated) return;

    try {
      if (favoritedIds.has(destinationId)) {
        await favoriteApi.removeFavorite(destinationId);
        setFavoritedIds(prev => { const s = new Set(prev); s.delete(destinationId); return s; });
        setFavorites(prev => prev.filter(f => f.destinationId !== destinationId));
      } else {
        const fav = await favoriteApi.addFavorite(destinationId);
        setFavoritedIds(prev => new Set([...prev, destinationId]));
        setFavorites(prev => [fav, ...prev]);
      }
    } catch {
      // Fail silently — show error toast in Phase 4
    }
  }, [isAuthenticated, favoritedIds]);

  const isFavorited = useCallback(
    (destinationId: string) => favoritedIds.has(destinationId),
    [favoritedIds]
  );

  return { favorites, loading, toggleFavorite, isFavorited };
}
