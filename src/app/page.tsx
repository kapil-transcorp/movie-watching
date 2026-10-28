import React from "react";
import Link from "next/link";
import { Film, Tv, Compass, Sparkles } from "lucide-react";
import {
  getTrending,
  getMoviesByCategory,
  getTVByCategory,
  discoverMedia,
  MOVIE_GENRES,
  TV_GENRES,
} from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import MediaRow from "@/components/MediaRow";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import ErrorState from "@/components/ErrorState";

export const revalidate = 1800;

export default async function HomePage() {
  const [
    trendingAll,
    popularMovies,
    popularSeries,
    nowPlayingMovies,
    topRatedSeries,
    topRatedMovies,
    bollywoodMovies,
    kdramaSeries,
    animeSeries,
  ] = await Promise.all([
    getTrending("all", "day"),
    getMoviesByCategory("popular"),
    getTVByCategory("popular"),
    getMoviesByCategory("now_playing"),
    getTVByCategory("top_rated"),
    getMoviesByCategory("top_rated"),
    discoverMedia({ type: "movie", language: "hi", sortBy: "popularity.desc" }),
    discoverMedia({ type: "tv", language: "ko", sortBy: "popularity.desc" }),
    discoverMedia({
      type: "tv",
      genre: "16",
      language: "ja",
      sortBy: "popularity.desc",
    }),
  ]);

  const top10Trending = (trendingAll.results || [])
    .filter((i) => i.media_type !== "person")
    .slice(0, 10);

  const allFailed =
    top10Trending.length === 0 &&
    popularMovies.results.length === 0 &&
    popularSeries.results.length === 0;

  if (allFailed) {
    return (
      <div className="pt-28 pb-16 px-4">
        <ErrorState
          title="Unable to Connect to TMDB Catalog"
          message={
            trendingAll.error ||
            "We could not load the streaming catalog right now. Please check your network connection and click Reload."
          }
          retryHref="/"
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Spotlight Hero Banner */}
      <HeroBanner items={top10Trending} />

      {/* Continue Watching History (Client localStorage) */}
      <ContinueWatchingRow />

      {/* Quick Category Pills Bar */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
          <Link
            href="/movies"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e50914] to-rose-700 text-white text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg shadow-[#e50914]/25"
          >
            <Film className="w-4 h-4" /> Full Movies
          </Link>
          <Link
            href="/series"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-600/25"
          >
            <Tv className="w-4 h-4" /> Web Series
          </Link>
          <Link
            href="/explore?language=hi&type=movie"
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-semibold shrink-0 transition-colors"
          >
            Bollywood Cinema
          </Link>
          <Link
            href="/explore?language=ko&type=tv"
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-semibold shrink-0 transition-colors"
          >
            K-Drama Series
          </Link>
          <Link
            href="/explore?genre=16&language=ja&type=tv"
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-semibold shrink-0 transition-colors"
          >
            Anime Hub
          </Link>
          {MOVIE_GENRES.slice(0, 7).map((genre) => (
            <Link
              key={genre.id}
              href={`/movies?genre=${genre.id}`}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium shrink-0 transition-colors"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Top 10 Trending Today */}
      <MediaRow
        title="Top 10 Trending Today"
        subtitle="Most streamed movies & web series across the globe right now"
        items={top10Trending}
        ranked
        exploreHref="/explore"
      />

      {/* Popular Blockbuster Movies */}
      <MediaRow
        title="Trending Full Movies"
        subtitle="Watch the biggest theatrical hits and new digital releases"
        items={popularMovies.results}
        defaultType="movie"
        exploreHref="/movies?category=popular"
      />

      {/* Hit Web Series & TV Shows */}
      <MediaRow
        title="Binge-Worthy Web Series"
        subtitle="Stream full seasons & episodes of trending web series"
        items={popularSeries.results}
        defaultType="tv"
        exploreHref="/series?category=popular"
      />

      {/* Now Playing in Theaters */}
      <MediaRow
        title="In Theaters & New Releases"
        subtitle="Freshly released movies now available to stream"
        items={nowPlayingMovies.results}
        defaultType="movie"
        exploreHref="/movies?category=now_playing"
      />

      {/* Bollywood & Hindi Spotlight */}
      <MediaRow
        title="Bollywood & Hindi Blockbusters"
        subtitle="Top Indian movies and cinema hits"
        items={bollywoodMovies.results}
        defaultType="movie"
        exploreHref="/explore?type=movie&language=hi"
      />

      {/* Critically Acclaimed Web Series */}
      <MediaRow
        title="Critically Acclaimed Web Series"
        subtitle="All-time highest rated television & web originals"
        items={topRatedSeries.results}
        defaultType="tv"
        exploreHref="/series?category=top_rated"
      />

      {/* K-Drama & Global Series */}
      <MediaRow
        title="K-Drama & Korean Originals"
        subtitle="Popular Korean dramas and thrillers"
        items={kdramaSeries.results}
        defaultType="tv"
        exploreHref="/explore?type=tv&language=ko"
      />

      {/* Anime Series */}
      <MediaRow
        title="Anime & Japanese Animation"
        subtitle="Fan-favorite anime series with full season guides"
        items={animeSeries.results}
        defaultType="tv"
        exploreHref="/explore?type=tv&genre=16&language=ja"
      />

      {/* Top Rated Movies of All Time */}
      <MediaRow
        title="Top Rated Cinema Masterpieces"
        subtitle="Highest rated movies of all time on TMDB"
        items={topRatedMovies.results}
        defaultType="movie"
        exploreHref="/movies?category=top_rated"
      />

      {/* Browse by Genre Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 rounded-full bg-[#e50914]" />
            <Sparkles className="w-5 h-5 text-[#e50914]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Browse Movies &amp; Web Series by Genre
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs sm:text-sm font-semibold text-[#e50914] hover:underline flex items-center gap-1"
          >
            <Compass className="w-4 h-4" /> Advanced Filter
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {MOVIE_GENRES.slice(0, 12).map((genre) => (
            <Link
              key={genre.id}
              href={`/movies?genre=${genre.id}`}
              className="group p-4 rounded-2xl bg-gradient-to-br from-[#151826] to-[#0d0f18] border border-white/10 hover:border-[#e50914]/60 transition-all flex flex-col justify-between h-24 shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#e50914] transition-colors">
                Movies
              </span>
              <span className="text-base font-bold text-white">
                {genre.name}
              </span>
            </Link>
          ))}
          {TV_GENRES.slice(0, 6).map((genre) => (
            <Link
              key={`tv-${genre.id}`}
              href={`/series?genre=${genre.id}`}
              className="group p-4 rounded-2xl bg-gradient-to-br from-[#111c29] to-[#0b1018] border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col justify-between h-24 shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Web Series
              </span>
              <span className="text-base font-bold text-white">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
