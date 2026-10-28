import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  User,
  Film,
  Tv,
} from "lucide-react";
import {
  getMovieDetails,
  getTVDetails,
  getTVSeasonDetails,
  getImageUrl,
  getMediaTitle,
  getReleaseYear,
  formatRuntime,
  TMDBError,
} from "@/lib/tmdb";
import StreamingPlayer from "@/components/StreamingPlayer";
import MediaRow from "@/components/MediaRow";
import ErrorState from "@/components/ErrorState";

interface WatchPageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
  searchParams: Promise<{
    season?: string;
    episode?: string;
  }>;
}

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const { type, id } = await params;
  const resolvedSearch = await searchParams;

  if (type !== "movie" && type !== "tv") {
    notFound();
  }

  const seasonNum = Math.max(1, Number(resolvedSearch.season || "1"));
  const episodeNum = Math.max(1, Number(resolvedSearch.episode || "1"));

  if (type === "movie") {
    let movie;
    try {
      movie = await getMovieDetails(id);
    } catch (err) {
      if (err instanceof TMDBError && err.status === 404) {
        notFound();
      }
      return (
        <div className="pt-28 pb-16 px-4">
          <ErrorState
            title="Could Not Initialize Movie Player"
            message={
              err instanceof Error
                ? err.message
                : "Temporary connection issue with TMDB."
            }
            retryHref={`/watch/movie/${id}`}
          />
        </div>
      );
    }

    const title = getMediaTitle(movie);
    const year = getReleaseYear(movie);
    const cast = (movie.credits?.cast || []).slice(0, 12);
    const recommendations =
      (movie.recommendations?.results?.length
        ? movie.recommendations.results
        : movie.similar?.results) || [];

    return (
      <div className="pt-24 pb-16 min-h-screen">
        {/* Back Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-4 flex items-center justify-between">
          <Link
            href={`/movie/${movie.id}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movie Details
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Film className="w-4 h-4 text-[#e50914]" />
            <span>Full Movie Cinema Room</span>
          </div>
        </div>

        {/* Full Multi-Server Streaming Player */}
        <StreamingPlayer
          id={movie.id}
          imdbId={movie.imdb_id}
          mediaType="movie"
          title={title}
          posterPath={movie.poster_path}
          backdropPath={movie.backdrop_path}
          voteAverage={movie.vote_average}
          releaseDate={movie.release_date}
        />

        {/* Movie Info & Synopsis Card */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-8">
          <div className="p-6 rounded-2xl bg-[#10121b] border border-white/10 flex flex-col md:flex-row gap-6">
            {movie.poster_path && (
              <img
                src={getImageUrl(movie.poster_path, "w342")}
                alt={title}
                className="w-32 sm:w-40 rounded-xl object-cover shrink-0 border border-white/10 hidden sm:block"
              />
            )}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-white">{title}</h2>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {year}
                </span>
                {movie.runtime > 0 && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />{" "}
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
              </div>

              {movie.tagline && (
                <p className="text-sm italic text-slate-400">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g) => (
                  <Link
                    key={g.id}
                    href={`/movies?genre=${g.id}`}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-[#e50914] text-slate-300 hover:text-white border border-white/10 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {movie.overview}
              </p>

              {/* Top Cast Pills */}
              {cast.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Starring Cast
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cast.slice(0, 8).map((actor) => (
                      <Link
                        key={actor.id}
                        href={`/person/${actor.id}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
                      >
                        <User className="w-3 h-3 text-[#e50914]" />
                        <span className="font-semibold">{actor.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar / Recommended Movies */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <MediaRow
              title="Recommended Movies to Watch Next"
              items={recommendations}
              defaultType="movie"
            />
          </div>
        )}
      </div>
    );
  }

  // Web Series (TV) Watch Room
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
          title="Could Not Initialize Web Series Player"
          message={
            err instanceof Error
              ? err.message
              : "Temporary connection issue with TMDB."
          }
          retryHref={`/watch/tv/${id}?season=${seasonNum}&episode=${episodeNum}`}
        />
      </div>
    );
  }

  let initialSeasonData = null;
  try {
    initialSeasonData = await getTVSeasonDetails(id, seasonNum);
  } catch {
    initialSeasonData = null;
  }

  const title = getMediaTitle(tv);
  const year = getReleaseYear(tv);
  const cast = (tv.credits?.cast || []).slice(0, 12);
  const recommendations =
    (tv.recommendations?.results?.length
      ? tv.recommendations.results
      : tv.similar?.results) || [];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Back Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-4 flex items-center justify-between">
        <Link
          href={`/tv/${tv.id}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Series Overview &amp; All Seasons
        </Link>

        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
          <Tv className="w-4 h-4" />
          <span>
            Web Series Player &bull; {tv.number_of_seasons} Seasons
          </span>
        </div>
      </div>

      {/* Full Multi-Server Web Series Player with Season & Episode Sidebar */}
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
        initialSeason={seasonNum}
        initialEpisode={episodeNum}
        initialEpisodes={initialSeasonData?.episodes || []}
      />

      {/* Series Info Card */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-8">
        <div className="p-6 rounded-2xl bg-[#10121b] border border-white/10 flex flex-col md:flex-row gap-6">
          {tv.poster_path && (
            <img
              src={getImageUrl(tv.poster_path, "w342")}
              alt={title}
              className="w-32 sm:w-40 rounded-xl object-cover shrink-0 border border-white/10 hidden sm:block"
            />
          )}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-black text-white">{title}</h2>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {tv.vote_average.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {year}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                {tv.number_of_seasons} Seasons &bull; {tv.number_of_episodes}{" "}
                Episodes
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tv.genres?.map((g) => (
                <Link
                  key={g.id}
                  href={`/series?genre=${g.id}`}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-[#e50914] text-slate-300 hover:text-white border border-white/10 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {tv.overview}
            </p>

            {cast.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Series Cast
                </p>
                <div className="flex flex-wrap gap-2">
                  {cast.slice(0, 8).map((actor) => (
                    <Link
                      key={actor.id}
                      href={`/person/${actor.id}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
                    >
                      <User className="w-3 h-3 text-cyan-400" />
                      <span className="font-semibold">{actor.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Web Series */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <MediaRow
            title="More Web Series Like This"
            items={recommendations}
            defaultType="tv"
          />
        </div>
      )}
    </div>
  );
}
