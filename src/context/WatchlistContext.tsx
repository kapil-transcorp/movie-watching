"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MediaItem } from "@/lib/tmdb";

export interface WatchHistoryItem {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  updatedAt: number;
}

interface WatchlistContextType {
  watchlist: MediaItem[];
  history: WatchHistoryItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number, mediaType?: "movie" | "tv") => void;
  toggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: number, mediaType?: "movie" | "tv") => boolean;
  addToHistory: (item: Omit<WatchHistoryItem, "updatedAt">) => void;
  removeFromHistory: (id: number, mediaType: "movie" | "tv") => void;
  clearHistory: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

const WATCHLIST_KEY = "cineverse_watchlist_v1";
const HISTORY_KEY = "cineverse_watch_history_v1";

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load watchlist/history from localStorage", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error("Failed to save watchlist", e);
    }
  }, [watchlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save watch history", e);
    }
  }, [history, hydrated]);

  const addToWatchlist = (item: MediaItem) => {
    const type =
      item.media_type === "tv" || (item.name && !item.title) ? "tv" : "movie";
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id && (i.media_type || "movie") === type)) {
        return prev;
      }
      return [{ ...item, media_type: type }, ...prev];
    });
  };

  const removeFromWatchlist = (id: number, mediaType?: "movie" | "tv") => {
    setWatchlist((prev) =>
      prev.filter((item) => {
        if (mediaType) {
          return !(item.id === id && item.media_type === mediaType);
        }
        return item.id !== id;
      })
    );
  };

  const isInWatchlist = (id: number, mediaType?: "movie" | "tv") => {
    return watchlist.some((item) => {
      if (mediaType) {
        return item.id === id && item.media_type === mediaType;
      }
      return item.id === id;
    });
  };

  const toggleWatchlist = (item: MediaItem) => {
    const type =
      item.media_type === "tv" || (item.name && !item.title) ? "tv" : "movie";
    if (isInWatchlist(item.id, type)) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist({ ...item, media_type: type });
    }
  };

  const addToHistory = (item: Omit<WatchHistoryItem, "updatedAt">) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (h) => !(h.id === item.id && h.media_type === item.media_type)
      );
      return [{ ...item, updatedAt: Date.now() }, ...filtered].slice(0, 24);
    });
  };

  const removeFromHistory = (id: number, mediaType: "movie" | "tv") => {
    setHistory((prev) =>
      prev.filter((h) => !(h.id === id && h.media_type === mediaType))
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        history,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        addToHistory,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}

