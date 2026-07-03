'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  discountPrice?: number;
}

interface StoredFavoriteItem extends FavoriteItem {
  addedAt: number; 
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorited: (id: string) => boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({} as FavoritesContextType);

const STORAGE_KEY = 'lyren_favorites';
const EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

function pruneExpired(items: StoredFavoriteItem[]): StoredFavoriteItem[] {
  const now = Date.now();
  return items.filter((item) => now - item.addedAt < EXPIRY_MS);
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<StoredFavoriteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const isLoaded = useRef(false);

  // Load + prune on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredFavoriteItem[] = JSON.parse(stored);
        setFavorites(pruneExpired(parsed));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage:', e);
      }
    }
    isLoaded.current = true;
  }, []);

  // Persist whenever favorites change
  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  // Periodic sweep so expired items disappear from the UI live,
  // without requiring a page refresh.
  useEffect(() => {
    const interval = setInterval(() => {
      setFavorites((prev) => {
        const pruned = pruneExpired(prev);
        return pruned.length !== prev.length ? pruned : prev;
      });
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, []);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) =>
      prev.find((f) => f.id === item.id)
        ? prev
        : [...prev, { ...item, addedAt: Date.now() }]
    );
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorited = (id: string) => favorites.some((f) => f.id === id);

  // Strip addedAt before exposing to consumers, since it's an internal detail
  const publicFavorites: FavoriteItem[] = favorites.map(({ addedAt, ...rest }) => rest);

  return (
    <FavoritesContext.Provider
      value={{ favorites: publicFavorites, addFavorite, removeFavorite, isFavorited, isOpen, setIsOpen }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);