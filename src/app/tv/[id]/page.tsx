import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  Star,
  Calendar,
  Tv,
  Globe,
  User,
  Layers,
} from "lucide-react";
import {
  getTVDetails,
  getTVSeasonDetails,
  getImageUrl,
  getMediaTitle,
  getReleaseYear,
  TMDBError,
} from "@/lib/tmdb";
import WatchlistButton from "@/components/WatchlistButton";
import SeasonEpisodeBrowser from "@/components/SeasonEpisodeBrowser";
import StreamingPlayer from "@/components/StreamingPlayer";
import MediaRow from "@/components/MediaRow";
import ErrorState from "@/components/ErrorState";

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVDetailPage({ params }: TVPageProps) {
  const { id } = await params;

  let tv;
  try {
    tv = await getTVDetails(id);
  } catch (err) {
    if (err instanceof TMDBError && err.status === 404) {
      notFound();
    }
    return (
      <div className="pt-28 pb-16 px-4">
        <ErrorState
          title="Could Not Load Web Series Details"
          message={
            err instanceof Error
              ? err.message
              : "Temporary network error while loading this web series."
          }
          retryHref={`/tv/${id}`}
        />
      </div>
    );
  }

  const validSeasons = (tv.seasons || []).filter((s) => s.season_number > 0);
  const firstSeasonNumber =
    validSeasons.length > 0 ? validSeasons[0].season_number : 1;

  let firstSeasonDetails = null;
  try {
    firstSeasonDetails = await getTVSeasonDetails(id, firstSeasonNumber);
  } catch {
    firstSeasonDetails = null;
  }

  const title = getMediaTitle(tv);
  const year = getReleaseYear(tv);
  const backdrop = getImageUrl(tv.backdrop_path, "original");
  const poster = getImageUrl(tv.poster_path, "w500");
  const cast = (tv.credits?.cast || []).slice(0, 14);
  const recommendations =
    (tv.recommendations?.results?.length
      ? tv.recommendations.results
      : tv.similar?.results) || [];

  return (
    <div className="pb-16">
      {/* Hero Backdrop Section */}
      <div className="relative min-h-[560px] lg:min-h-[680px] flex items-end pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {backdrop && (
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover object-center scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080d] via-[#07080d]/85 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/40 to-black/40" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 w-full flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Series Poster */}
          <div className="w-52 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden bg-[#161926] border-2 border-white/15 shadow-2xl shrink-0">
            {poster ? (
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tv className="w-12 h-12 text-slate-600" />
              </div>
            )}
          </div>

          {/* Series Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-black text-xs font-extrabold uppercase tracking-wider">
                Web Series
              </span>
              {tv.vote_average > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {tv.vote_average.toFixed(1)} ({tv.vote_count} votes)
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" /> {year}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 rounded-full">
                <Layers className="w-3.5 h-3.5" /> {tv.number_of_seasons}{" "}
                Seasons &bull; {tv.number_of_episodes} Episodes
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full uppercase">
                <Globe className="w-3.5 h-3.5" />{" "}
                {tv.original_language || "EN"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {title}
            </h1>

            {tv.tagline && (
              <p className="text-base italic text-cyan-300/90 font-medium">
                &ldquo;{tv.tagline}&rdquo;
              </p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {tv.genres?.map((g) => (
                <Link
                  key={g.id}
                  href={`/series?genre=${g.id}`}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#e50914] text-white border border-white/15 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {tv.overview}
            </p>

            {/* Primary Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3.5">
              <Link
                href={`/watch/tv/${tv.id}?season=${firstSeasonNumber}&episode=1`}
                className="px-8 py-4 rounded-2xl bg-[#e50914] hover:bg-[#f6121d] text-white font-bold text-base flex items-center gap-2.5 shadow-xl shadow-[#e50914]/40 hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Stream Season {firstSeasonNumber}, Episode 1</span>
              </Link>

              <a
                href="#episodes"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base flex items-center gap-2 border border-white/15 backdrop-blur-md transition-all"
              >
                <Tv className="w-5 h-5 text-cyan-400" />
                <span>Browse All Seasons &amp; Episodes</span>
              </a>

              <WatchlistButton
                item={{
                  ...tv,
                  media_type: "tv",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instant Embedded Web Series Player */}
      <div className="mt-6">
        <StreamingPlayer
          id={tv.id}
          imdbId={tv.external_ids?.imdb_id}
          mediaType="tv"
          title={title}
          posterPath={tv.poster_path}
          backdropPath={tv.backdrop_path}
          voteAverage={tv.vote_average}
          releaseDate={tv.first_air_date}
          seasons={tv.seasons || []}
          initialSeason={firstSeasonNumber}
          initialEpisode={1}
          initialEpisodes={firstSeasonDetails?.episodes || []}
        />
      </div>

      {/* Main Content Container */}
      <div
        id="episodes"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12 mt-10 scroll-mt-20"
      >
        {/* Interactive Season & Episode Browser */}
        <SeasonEpisodeBrowser
          tvId={tv.id}
          seasons={tv.seasons || []}
          initialSeasonNumber={firstSeasonNumber}
          initialEpisodes={firstSeasonDetails?.episodes || []}
        />

        {/* Series Cast */}
        {cast.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-6 rounded-full bg-[#e50914]" />
              <h2 className="text-2xl font-bold text-white">Series Cast</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {cast.map((actor) => {
                const avatar = getImageUrl(actor.profile_path, "w185");
                return (
                  <Link
                    key={actor.id}
                    href={`/person/${actor.id}`}
                    className="group w-32 sm:w-36 shrink-0 rounded-2xl overflow-hidden bg-[#121521] border border-white/10 hover:border-[#e50914]/60 transition-all p-2.5 text-center"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-800 mb-2.5 border-2 border-white/10 group-hover:border-[#e50914]">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={actor.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-[#e50914] line-clamp-1">
                      {actor.name}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {actor.character}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Similar Web Series */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <MediaRow
            title="Similar & Recommended Web Series"
            subtitle="More binge-worthy series to stream next"
            items={recommendations}
            defaultType="tv"
          />
        </div>
      )}
    </div>
  );
}
