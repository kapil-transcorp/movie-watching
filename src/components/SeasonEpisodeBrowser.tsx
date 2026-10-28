"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Play, Tv, Clock, Star, Calendar } from "lucide-react";
import {
  Episode,
  SeasonSummary,
  getImageUrl,
  formatRuntime,
} from "@/lib/tmdb";
import { EpisodeCardShimmer } from "./Skeletons";
import ErrorState from "./ErrorState";

interface SeasonEpisodeBrowserProps {
  tvId: number;
  seasons: SeasonSummary[];
  initialSeasonNumber?: number;
  initialEpisodes: Episode[];
}

export default function SeasonEpisodeBrowser({
  tvId,
  seasons,
  initialSeasonNumber = 1,
  initialEpisodes,
}: SeasonEpisodeBrowserProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState(initialSeasonNumber);
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeason = useCallback(
    async (seasonNum: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tmdb/season?tvId=${tvId}&season=${seasonNum}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load Season ${seasonNum} episodes`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEpisodes(data.episodes || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load episodes for this season."
        );
      } finally {
        setLoading(false);
      }
    },
    [tvId]
  );

  useEffect(() => {
    if (
      selectedSeason === initialSeasonNumber &&
      initialEpisodes &&
      initialEpisodes.length > 0
    ) {
      setEpisodes(initialEpisodes);
      setError(null);
      return;
    }
    fetchSeason(selectedSeason);
  }, [selectedSeason, initialSeasonNumber, initialEpisodes, fetchSeason]);

  return (
    <section className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full bg-cyan-400" />
          <Tv className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            Seasons &amp; Full Episodes
          </h2>
        </div>

        {/* Season Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {validSeasons.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSeason(s.season_number)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                selectedSeason === s.season_number
                  ? "bg-[#e50914] text-white border-[#e50914] shadow-lg shadow-[#e50914]/30"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              Season {s.season_number}
              <span className="ml-1.5 opacity-75">({s.episode_count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Episodes Grid with Shimmer & Error Handling */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, idx) => (
            <EpisodeCardShimmer key={idx} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          compact
          title={`Could not load Season ${selectedSeason}`}
          message={error}
          onRetry={() => fetchSeason(selectedSeason)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {episodes.map((ep) => {
            const still = getImageUrl(ep.still_path, "w500");
            const watchUrl = `/watch/tv/${tvId}?season=${selectedSeason}&episode=${ep.episode_number}`;

            return (
              <Link
                key={ep.id}
                href={watchUrl}
                className="group rounded-2xl overflow-hidden bg-[#121521] border border-white/10 hover:border-[#e50914]/60 transition-all flex flex-col shadow-lg hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {still ? (
                    <img
                      src={still}
                      alt={ep.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Tv className="w-10 h-10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-[#e50914]/50 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-extrabold text-white border border-white/15">
                    S{selectedSeason} &bull; EP {ep.episode_number}
                  </span>

                  {ep.runtime && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRuntime(ep.runtime)}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#e50914] transition-colors line-clamp-1">
                      {ep.episode_number}. {ep.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {ep.overview ||
                        "Click to stream this full episode in HD."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-xs text-slate-400">
                    {ep.air_date ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {ep.air_date}
                      </span>
                    ) : (
                      <span>Stream Ready</span>
                    )}

                    {ep.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
