import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weather-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites:', err);
    }
  }, [favorites]);

  const addFavorite = useCallback((city) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.toLowerCase() === city.toLowerCase())) {
        return prev;
      }
      return [...prev, city];
    });
  }, []);

  const removeFavorite = useCallback((city) => {
    setFavorites((prev) =>
      prev.filter((f) => f.toLowerCase() !== city.toLowerCase())
    );
  }, []);

  const isFavorite = useCallback(
    (city) => {
      if (!city) return false;
      return favorites.some((f) => f.toLowerCase() === city.toLowerCase());
    },
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
