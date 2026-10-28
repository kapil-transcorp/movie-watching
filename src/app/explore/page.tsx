import React from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  SlidersHorizontal,
  Film,
  Tv,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  discoverMedia,
  searchMulti,
  MOVIE_GENRES,
  TV_GENRES,
  LANGUAGES,
} from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import ErrorState from "@/components/ErrorState";

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    genre?: string;
    language?: string;
    year?: string;
    sortBy?: string;
    minRating?: string;
    page?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const type = (params.type === "tv" ? "tv" : "movie") as "movie" | "tv";
  const genre = params.genre || "";
  const language = params.language || "";
  const year = params.year || "";
  const sortBy = params.sortBy || "popularity.desc";
  const minRating = params.minRating || "";
  const page = Math.max(1, Number(params.page || "1"));

  const data = query
    ? await searchMulti(query, page)
    : await discoverMedia({
        type,
        genre,
        language,
        year,
        sortBy,
        minRating,
        page,
      });

  const mediaResults = (data.results || []).filter(
    (item) => item.media_type !== "person"
  );

  const genres = type === "tv" ? TV_GENRES : MOVIE_GENRES;
  const years = Array.from({ length: 30 }, (_, i) => String(2026 - i));

  const buildUrl = (updates: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    const merged = {
      q: query,
      type,
      genre,
      language,
      year,
      sortBy,
      minRating,
      page: 1,
      ...updates,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && !(k === "page" && v === 1)) {
        sp.set(k, String(v));
      }
    });
    const qs = sp.toString();
    return `/explore${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e50914] to-amber-600 flex items-center justify-center text-white shadow-lg">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {query
              ? `Search Results for "${query}"`
              : "Explore & Advanced Filter"}
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1.5">
          Filter across thousands of TMDB Movies &amp; Web Series by genre,
          language, release year, and rating.
        </p>
      </div>

      {/* Filter Control Panel */}
      <form
        action="/explore"
        method="GET"
        className="p-5 rounded-2xl bg-[#10121b] border border-white/10 mb-8 space-y-4 shadow-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Keyword Search (Optional)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search title, series, keyword..."
                className="w-full bg-[#07080d] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e50914]"
              />
            </div>
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Format
            </label>
            <select
              name="type"
              defaultValue={type}
              className="w-full bg-[#07080d] border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#e50914]"
            >
              <option value="movie">Movies</option>
              <option value="tv">Web Series / TV</option>
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Genre
            </label>
            <select
              name="genre"
              defaultValue={genre}
              className="w-full bg-[#07080d] border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#e50914]"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Original Language
            </label>
            <select
              name="language"
              defaultValue={language}
              className="w-full bg-[#07080d] border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#e50914]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code || "all"} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Sort Order
            </label>
            <select
              name="sortBy"
              defaultValue={sortBy}
              className="w-full bg-[#07080d] border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#e50914]"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest Releases</option>
              <option value="revenue.desc">Highest Box Office</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Release Year */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Year:</span>
              <select
                name="year"
                defaultValue={year}
                className="bg-[#07080d] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Min Rating:</span>
              <select
                name="minRating"
                defaultValue={minRating}
                className="bg-[#07080d] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="">Any Rating</option>
                <option value="8">8.0+ Masterpieces</option>
                <option value="7">7.0+ Great</option>
                <option value="6">6.0+ Good</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/explore"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/10"
            >
              Reset Filters
            </Link>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-[#e50914]/30"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* Quick Type Switcher Pills */}
      {!query && (
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={buildUrl({ type: "movie", genre: "", page: 1 })}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              type === "movie"
                ? "bg-[#e50914] text-white border-[#e50914]"
                : "bg-white/5 text-slate-300 border-white/10"
            }`}
          >
            <Film className="w-4 h-4" /> Movies
          </Link>
          <Link
            href={buildUrl({ type: "tv", genre: "", page: 1 })}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              type === "tv"
                ? "bg-cyan-500 text-black border-cyan-400"
                : "bg-white/5 text-slate-300 border-white/10"
            }`}
          >
            <Tv className="w-4 h-4" /> Web Series
          </Link>
        </div>
      )}

      {/* Results Grid or Error State */}
      {data.error ? (
        <ErrorState
          title="Could Not Load Explore Results"
          message={data.error}
          retryHref={buildUrl({ page })}
        />
      ) : mediaResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {mediaResults.map((item) => (
            <MediaCard
              key={`${item.media_type || type}-${item.id}`}
              item={item}
              defaultType={type}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-[#10121b] border border-white/10">
          <p className="text-lg font-bold text-white">
            No matching movies or web series found
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search keywords or filter criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={buildUrl({ page: page - 1 })}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#e50914] border border-white/10 text-sm font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          )}
          <span className="px-4 py-2.5 rounded-xl bg-[#10121b] border border-white/10 text-sm font-bold text-slate-300">
            Page <span className="text-white">{page}</span> of{" "}
            {Math.min(data.total_pages, 500)}
          </span>
          {page < Math.min(data.total_pages, 500) && (
            <Link
              href={buildUrl({ page: page + 1 })}
              className="px-4 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-sm font-bold text-white flex items-center gap-1.5 shadow-lg transition-colors"
            >
              Next Page <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
