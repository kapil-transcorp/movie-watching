import React from "react";
import Link from "next/link";
import {
  Tv,
  Flame,
  Star,
  Radio,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getTVByCategory,
  discoverMedia,
  TV_GENRES,
  LANGUAGES,
} from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import ErrorState from "@/components/ErrorState";

interface SeriesPageProps {
  searchParams: Promise<{
    category?: string;
    genre?: string;
    language?: string;
    page?: string;
  }>;
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const params = await searchParams;
  const category = (params.category || "popular") as
    | "popular"
    | "top_rated"
    | "on_the_air"
    | "airing_today";
  const genre = params.genre || "";
  const language = params.language || "";
  const page = Math.max(1, Number(params.page || "1"));

  const data =
    genre || language
      ? await discoverMedia({
          type: "tv",
          genre,
          language,
          sortBy:
            category === "top_rated"
              ? "vote_average.desc"
              : "popularity.desc",
          page,
        })
      : await getTVByCategory(category, page);

  const selectedGenreName = TV_GENRES.find(
    (g) => String(g.id) === genre
  )?.name;

  const categories = [
    { id: "popular", label: "Popular Series", icon: Flame },
    { id: "top_rated", label: "Top Rated Series", icon: Star },
    { id: "on_the_air", label: "Currently Airing", icon: Radio },
    { id: "airing_today", label: "New Episodes Today", icon: Calendar },
  ];

  const buildUrl = (updates: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    const merged = {
      category,
      genre,
      language,
      page: 1,
      ...updates,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && !(k === "page" && v === 1)) {
        sp.set(k, String(v));
      }
    });
    const qs = sp.toString();
    return `/series${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {selectedGenreName
                ? `${selectedGenreName} Web Series`
                : "Web Series & TV Shows"}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1.5">
            Stream complete seasons and episodes of global web series, K-Dramas,
            Anime, and TV originals.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#10121b] p-1.5 rounded-2xl border border-white/10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id && !genre;
            return (
              <Link
                key={cat.id}
                href={buildUrl({ category: cat.id, genre: "", page: 1 })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  active
                    ? "bg-[#e50914] text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Language & Genre Filters */}
      <div className="space-y-3 mb-8">
        {/* Language Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Language:
          </span>
          {LANGUAGES.slice(0, 8).map((lang) => {
            const active = language === lang.code;
            return (
              <Link
                key={lang.code || "all"}
                href={buildUrl({ language: lang.code, page: 1 })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
                  active
                    ? "bg-cyan-500 text-black border-cyan-400 font-bold"
                    : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {lang.label}
              </Link>
            );
          })}
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Genre:
          </span>
          <Link
            href={buildUrl({ genre: "", page: 1 })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              !genre
                ? "bg-[#e50914] text-white border-[#e50914]"
                : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            All Genres
          </Link>
          {TV_GENRES.map((g) => {
            const active = String(g.id) === genre;
            return (
              <Link
                key={g.id}
                href={buildUrl({ genre: g.id, page: 1 })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
                  active
                    ? "bg-[#e50914] text-white border-[#e50914]"
                    : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {g.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Series Grid or Error State */}
      {data.error ? (
        <ErrorState
          title="Failed to Load Web Series"
          message={data.error}
          retryHref={buildUrl({ page })}
        />
      ) : data.results && data.results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {data.results.map((series) => (
            <MediaCard key={series.id} item={series} defaultType="tv" />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-[#10121b] border border-white/10">
          <p className="text-lg font-bold text-white">No web series found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try clearing your genre or language filter.
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
