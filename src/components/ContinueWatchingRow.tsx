"use client";

import React from "react";
import Link from "next/link";
import { Play, X, Clock, Trash2, Tv, Film } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { getImageUrl } from "@/lib/tmdb";

export default function ContinueWatchingRow() {
  const { history, removeFromHistory, clearHistory } = useWatchlist();

  if (!history || history.length === 0) return null;

  return (
    <section className="py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full bg-amber-500" />
          <Clock className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Continue Watching
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
            {history.length}
          </span>
        </div>

        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {history.map((item) => {
          const thumb = getImageUrl(
            item.backdrop_path || item.poster_path,
            "w500"
          );
          const watchHref =
            item.media_type === "tv"
              ? `/watch/tv/${item.id}?season=${item.season || 1}&episode=${
                  item.episode || 1
                }`
              : `/watch/movie/${item.id}`;

          return (
            <div
              key={`${item.media_type}-${item.id}`}
              className="group relative w-[260px] sm:w-[300px] shrink-0 rounded-2xl overflow-hidden bg-[#121521] border border-white/10 hover:border-amber-500/50 transition-all shadow-lg"
            >
              <Link href={watchHref} className="block relative aspect-video">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    {item.media_type === "tv" ? (
                      <Tv className="w-8 h-8 text-slate-500" />
                    ) : (
                      <Film className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#e50914]/90 text-white flex items-center justify-center shadow-lg shadow-[#e50914]/50 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Episode or Movie Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                    {item.media_type === "tv"
                      ? `S${item.season || 1} : E${item.episode || 1}`
                      : "Movie"}
                  </span>
                </div>

                {/* Simulated Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full w-2/3 bg-[#e50914]" />
                </div>
              </Link>

              <button
                type="button"
                onClick={() => removeFromHistory(item.id, item.media_type)}
                title="Remove from history"
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/75 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="p-3">
                <Link
                  href={watchHref}
                  className="text-sm font-bold text-white hover:text-[#e50914] line-clamp-1 transition-colors"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {item.media_type === "tv"
                    ? item.episodeTitle
                      ? `Ep ${item.episode}: ${item.episodeTitle}`
                      : `Resume Season ${item.season || 1}, Episode ${
                          item.episode || 1
                        }`
                    : "Resume Full Movie"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

