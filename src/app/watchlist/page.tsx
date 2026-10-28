"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Clock, Film, Tv, Compass, Trash2 } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import MediaCard from "@/components/MediaCard";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const filteredList = watchlist.filter((item) => {
    if (filter === "all") return true;
    return (item.media_type || "movie") === filter;
  });

  return (
    <div className="pt-28 pb-16 min-h-screen">
      {/* Continue Watching History */}
      <ContinueWatchingRow />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e50914] flex items-center justify-center text-white shadow-lg shadow-[#e50914]/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                My Watchlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Your saved movies and web series ready to stream anytime.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#10121b] p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-[#e50914] text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              All ({watchlist.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("movie")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filter === "movie"
                  ? "bg-[#e50914] text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Movies
            </button>
            <button
              type="button"
              onClick={() => setFilter("tv")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filter === "tv"
                  ? "bg-[#e50914] text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> Web Series
            </button>
          </div>
        </div>

        {filteredList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredList.map((item) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                defaultType={item.media_type === "tv" ? "tv" : "movie"}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl bg-[#10121b] border border-white/10 max-w-xl mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Your Watchlist is Empty
            </h2>
            <p className="text-sm text-slate-400">
              Click the + button on any movie or web series card to save it here
              for instant watching.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/movies"
                className="px-5 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-bold"
              >
                Browse Movies
              </Link>
              <Link
                href="/series"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
              >
                Browse Web Series
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

