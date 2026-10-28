"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Info,
  Plus,
  Check,
  Star,
  Calendar,
  Flame,
  ChevronLeft,
  ChevronRight,
  Film,
  Tv,
} from "lucide-react";
import {
  MediaItem,
  getImageUrl,
  getMediaTitle,
  getReleaseYear,
  getMediaType,
  getGenreNames,
} from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface HeroBannerProps {
  items: MediaItem[];
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const heroItems = (items || []).filter((i) => i.backdrop_path).slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  if (heroItems.length === 0) return null;

  const current = heroItems[activeIndex];
  const type = getMediaType(current);
  const title = getMediaTitle(current);
  const year = getReleaseYear(current);
  const genres = getGenreNames(current.genre_ids);
  const backdrop = getImageUrl(current.backdrop_path, "original");
  const saved = isInWatchlist(current.id, type);

  const watchHref =
    type === "tv"
      ? `/watch/tv/${current.id}?season=1&episode=1`
      : `/watch/movie/${current.id}`;
  const detailHref = type === "tv" ? `/tv/${current.id}` : `/movie/${current.id}`;

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[760px] flex items-end pb-12 sm:pb-16 overflow-hidden">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        {backdrop && (
          <img
            key={current.id}
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover object-center scale-105 animate-fadeIn transition-all duration-1000"
          />
        )}
        {/* Multi-layer Cinema Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080d] via-[#07080d]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/35 to-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 w-full pt-28 flex flex-col lg:flex-row items-end justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          {/* Spotlight Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#e50914]/30">
              <Flame className="w-3.5 h-3.5 fill-white" />
              #{activeIndex + 1} Spotlight
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase text-cyan-300">
              {type === "tv" ? (
                <>
                  <Tv className="w-3.5 h-3.5" /> Web Series
                </>
              ) : (
                <>
                  <Film className="w-3.5 h-3.5" /> Full Movie
                </>
              )}
            </span>

            {current.vote_average > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {current.vote_average.toFixed(1)} TMDB
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {year}
            </span>

            <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-white border border-white/15">
              4K UHD
            </span>
          </div>

          {/* Headline Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-xl">
            {title}
          </h1>

          {/* Genre Pills */}
          {genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-white/[0.07] text-slate-200 border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {current.overview}
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <Link
              href={watchHref}
              className="px-7 py-3.5 rounded-2xl bg-[#e50914] hover:bg-[#f6121d] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-[#e50914]/40 hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>
                {type === "tv" ? "Watch Series (S1:E1)" : "Watch Full Movie"}
              </span>
            </Link>

            <Link
              href={detailHref}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base flex items-center gap-2 backdrop-blur-md border border-white/15 transition-all"
            >
              <Info className="w-5 h-5" />
              <span>Details &amp; Trailers</span>
            </Link>

            <button
              type="button"
              onClick={() => toggleWatchlist({ ...current, media_type: type })}
              className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all flex items-center justify-center ${
                saved
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
              title={saved ? "In My Watchlist" : "Add to My Watchlist"}
            >
              {saved ? (
                <Check className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Right Side Carousel Thumbnails & Controls */}
        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (prev) => (prev - 1 + heroItems.length) % heroItems.length
                )
              }
              className="p-2 rounded-full bg-black/60 hover:bg-[#e50914] text-white border border-white/15 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % heroItems.length)
              }
              className="p-2 rounded-full bg-black/60 hover:bg-[#e50914] text-white border border-white/15 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar max-w-full pb-1">
            {heroItems.map((item, idx) => {
              const thumb = getImageUrl(
                item.poster_path || item.backdrop_path,
                "w185"
              );
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-14 h-20 sm:w-16 sm:h-24 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                    isActive
                      ? "border-[#e50914] scale-105 shadow-lg shadow-[#e50914]/40"
                      : "border-white/15 opacity-50 hover:opacity-90"
                  }`}
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={getMediaTitle(item)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

