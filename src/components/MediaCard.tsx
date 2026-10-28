"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Star, Plus, Check, Info, Film, Tv } from "lucide-react";
import {
  MediaItem,
  getImageUrl,
  getMediaTitle,
  getReleaseYear,
  getMediaType,
} from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface MediaCardProps {
  item: MediaItem;
  defaultType?: "movie" | "tv";
  rank?: number;
}

export default function MediaCard({
  item,
  defaultType = "movie",
  rank,
}: MediaCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const type = getMediaType(item, defaultType);
  const title = getMediaTitle(item);
  const year = getReleaseYear(item);
  const poster = getImageUrl(item.poster_path, "w500");
  const saved = isInWatchlist(item.id, type);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const detailHref = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
  const watchHref =
    type === "tv"
      ? `/watch/tv/${item.id}?season=1&episode=1`
      : `/watch/movie/${item.id}`;

  return (
    <div className="group relative flex flex-col select-none">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#161926] border border-white/10 shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:border-[#e50914]/60 group-hover:shadow-2xl group-hover:shadow-[#e50914]/15">
        {/* Shimmer while image is loading */}
        {poster && !imgLoaded && !imgError && (
          <div className="absolute inset-0 shimmer z-0" />
        )}

        {poster && !imgError ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-800 to-slate-950">
            {type === "tv" ? (
              <Tv className="w-10 h-10 text-slate-600 mb-2" />
            ) : (
              <Film className="w-10 h-10 text-slate-600 mb-2" />
            )}
            <span className="text-xs font-medium text-slate-400 line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
              type === "tv"
                ? "bg-cyan-500/80 text-white border-cyan-400/50"
                : "bg-[#e50914]/85 text-white border-rose-400/50"
            }`}
          >
            {type === "tv" ? "Series" : "Movie"}
          </span>

          {item.vote_average > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-amber-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        {/* Rank Number Badge (if Top 10) */}
        {typeof rank === "number" && (
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span
              className="text-5xl font-black italic leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
              style={{
                WebkitTextStroke: "2px #e50914",
              }}
            >
              #{rank}
            </span>
          </div>
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-20">
          <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
            {item.overview || "Stream in full HD on CineVerse."}
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={watchHref}
              className="flex-1 py-2 px-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#e50914]/40 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Watch Now
            </Link>

            <Link
              href={detailHref}
              title="Details & Episodes"
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors"
            >
              <Info className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleWatchlist({ ...item, media_type: type });
              }}
              title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
              className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              {saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Title & Year below Poster */}
      <div className="mt-2.5 px-0.5">
        <Link
          href={detailHref}
          className="text-sm font-semibold text-slate-100 group-hover:text-[#e50914] transition-colors line-clamp-1"
        >
          {title}
        </Link>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5">
          <span>{year}</span>
          <span className="uppercase text-[10px] tracking-wider text-slate-500">
            {item.original_language || "EN"} &bull; HD
          </span>
        </div>
      </div>
    </div>
  );
}
