"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "julia-favorites";

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (artworkId: number) => boolean;
  toggleFavorite: (artworkId: number) => void;
  count: number;
}

function load(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch { /* quota */ }
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(favorites);
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, count: favorites.length }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
