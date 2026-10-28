"use client";

import React from "react";
import { Plus, Check } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

export default function WatchlistButton({ item }: { item: MediaItem }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const type = item.media_type === "tv" ? "tv" : "movie";
  const saved = isInWatchlist(item.id, type);

  return (
    <button
      type="button"
      onClick={() => toggleWatchlist(item)}
      className={`px-6 py-3.5 rounded-2xl font-semibold text-sm sm:text-base flex items-center gap-2 border backdrop-blur-md transition-all ${
        saved
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
          : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
      }`}
    >
      {saved ? (
        <>
          <Check className="w-5 h-5" />
          <span>In My Watchlist</span>
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          <span>Add to Watchlist</span>
        </>
      )}
    </button>
  );
}

