import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Globe,
  Film,
  User,
  MonitorPlay,
  MessageSquare,
} from "lucide-react";
import {
  getMovieDetails,
  getImageUrl,
  getMediaTitle,
  getReleaseYear,
  formatRuntime,
  TMDBError,
} from "@/lib/tmdb";
import WatchlistButton from "@/components/WatchlistButton";
import StreamingPlayer from "@/components/StreamingPlayer";
import MediaRow from "@/components/MediaRow";
import ErrorState from "@/components/ErrorState";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;

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
          title="Could Not Load Movie Details"
          message={
            err instanceof Error
              ? err.message
              : "Temporary network error while loading this movie."
          }
          retryHref={`/movie/${id}`}
        />
      </div>
    );
  }

  const title = getMediaTitle(movie);
  const year = getReleaseYear(movie);
  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const poster = getImageUrl(movie.poster_path, "w500");
  const cast = (movie.credits?.cast || []).slice(0, 14);
  const directors = (movie.credits?.crew || []).filter(
    (c) => c.job === "Director"
  );
  const recommendations =
    (movie.recommendations?.results?.length
      ? movie.recommendations.results
      : movie.similar?.results) || [];
  const reviews = (movie.reviews?.results || []).slice(0, 4);

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
          {/* Movie Poster */}
          <div className="w-52 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden bg-[#161926] border-2 border-white/15 shadow-2xl shrink-0">
            {poster ? (
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-12 h-12 text-slate-600" />
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#e50914] text-white text-xs font-extrabold uppercase tracking-wider">
                Full Movie
              </span>
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" /> {year}
              </span>
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />{" "}
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full uppercase">
                <Globe className="w-3.5 h-3.5" />{" "}
                {movie.original_language || "EN"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {title}
            </h1>

            {movie.tagline && (
              <p className="text-base italic text-amber-400/90 font-medium">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {movie.genres?.map((g) => (
                <Link
                  key={g.id}
                  href={`/movies?genre=${g.id}`}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#e50914] text-white border border-white/15 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {movie.overview}
            </p>

            {directors.length > 0 && (
              <p className="text-xs text-slate-400">
                Directed by:{" "}
                <span className="text-white font-semibold">
                  {directors.map((d) => d.name).join(", ")}
                </span>
              </p>
            )}

            {/* Primary Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3.5">
              <Link
                href={`/watch/movie/${movie.id}`}
                className="px-8 py-4 rounded-2xl bg-[#e50914] hover:bg-[#f6121d] text-white font-bold text-base flex items-center gap-2.5 shadow-xl shadow-[#e50914]/40 hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Open Cinema Watch Room</span>
              </Link>

              <a
                href="#stream-now"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base flex items-center gap-2 border border-white/15 backdrop-blur-md transition-all"
              >
                <MonitorPlay className="w-5 h-5 text-[#e50914]" />
                <span>Stream Here Below</span>
              </a>

              <WatchlistButton
                item={{
                  ...movie,
                  media_type: "movie",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instant Embedded Full Movie Player */}
      <div id="stream-now" className="mt-6 scroll-mt-24">
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
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12 mt-12">
        {/* Top Cast Section */}
        {cast.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-6 rounded-full bg-[#e50914]" />
              <h2 className="text-2xl font-bold text-white">Top Cast</h2>
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

        {/* Audience Reviews */}
        {reviews.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-6 rounded-full bg-amber-500" />
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                Viewer Reviews ({reviews.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#121521] border border-white/10 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {rev.author}
                    </span>
                    {rev.author_details?.rating && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {rev.author_details.rating}/10
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Similar & Recommended Movies */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <MediaRow
            title="Similar & Recommended Movies"
            subtitle="More movies you can watch right now"
            items={recommendations}
            defaultType="movie"
          />
        </div>
      )}
    </div>
  );
}
