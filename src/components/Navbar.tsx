"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Film,
  Tv,
  Compass,
  Bookmark,
  Search,
  Play,
  Star,
  X,
  Menu,
  Sparkles,
  User,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import {
  MediaItem,
  getImageUrl,
  getMediaTitle,
  getReleaseYear,
} from "@/lib/tmdb";
import { SearchDropdownShimmer } from "./Skeletons";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { watchlist } = useWatchlist();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 60);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchError(null);
      return;
    }

    setLoading(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `/api/tmdb/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      if (!res.ok) {
        throw new Error("Search service temporarily unavailable");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResults((data.results || []).slice(0, 8));
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "Failed to search TMDB"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      performSearch(query);
    }, 280);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/series", label: "Web Series", icon: Tv },
    { href: "/explore", label: "Explore & Filter", icon: Compass },
    {
      href: "/watchlist",
      label: "My List",
      icon: Bookmark,
      badge: watchlist.length,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07080d]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80 py-3"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e50914] to-rose-700 flex items-center justify-center shadow-lg shadow-[#e50914]/30 group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                CINE<span className="text-[#e50914]">VERSE</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                4K STREAM
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
              Movies &bull; Web Series &bull; Live Cinema
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full px-2 py-1 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
                      active
                        ? "bg-white text-[#e50914]"
                        : "bg-[#e50914] text-white"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Quick Actions */}
        <div className="flex items-center gap-3" ref={searchRef}>
          {/* Live Search Bar */}
          <div className="relative">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center transition-all duration-300 rounded-full border ${
                searchOpen
                  ? "w-64 sm:w-80 md:w-96 bg-[#10121b] border-[#e50914]/60 shadow-lg shadow-[#e50914]/10"
                  : "w-44 sm:w-64 bg-white/[0.06] border-white/10 hover:border-white/25"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-[#e50914] ml-3.5 shrink-0 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search movies, web series, actors..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 px-3 py-2 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setSearchError(null);
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 mr-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block mr-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
                  Ctrl K
                </kbd>
              )}
            </form>

            {/* Instant Search Dropdown */}
            {searchOpen && (query.trim().length > 0 || loading) && (
              <div className="absolute right-0 mt-2 w-[340px] sm:w-[440px] bg-[#10121b]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Instant TMDB Search</span>
                  {loading && (
                    <span className="text-[#e50914] flex items-center gap-1.5 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Searching...
                    </span>
                  )}
                </div>

                {loading ? (
                  <SearchDropdownShimmer />
                ) : searchError ? (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-rose-300 font-medium">
                      {searchError}
                    </p>
                    <button
                      type="button"
                      onClick={() => performSearch(query)}
                      className="px-4 py-1.5 rounded-lg bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry Search
                    </button>
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-white/5">
                    {results.map((item) => {
                      const mediaType =
                        item.media_type ||
                        (item.name && !item.title ? "tv" : "movie");
                      const title = getMediaTitle(item);
                      const year = getReleaseYear(item);
                      const poster = getImageUrl(
                        item.poster_path || item.profile_path,
                        "w185"
                      );
                      const href =
                        mediaType === "person"
                          ? `/person/${item.id}`
                          : mediaType === "tv"
                          ? `/tv/${item.id}`
                          : `/movie/${item.id}`;

                      return (
                        <div
                          key={`${mediaType}-${item.id}`}
                          className="flex items-center justify-between gap-3 p-3 hover:bg-white/[0.06] transition-colors"
                        >
                          <Link
                            href={href}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 flex-1 min-w-0"
                          >
                            <div className="w-11 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                              {poster ? (
                                <img
                                  src={poster}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                  {mediaType === "person" ? (
                                    <User className="w-5 h-5" />
                                  ) : (
                                    <Film className="w-5 h-5" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-white truncate">
                                {title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                <span
                                  className={`uppercase text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    mediaType === "tv"
                                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                      : mediaType === "person"
                                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  }`}
                                >
                                  {mediaType === "tv"
                                    ? "Web Series"
                                    : mediaType === "person"
                                    ? "Actor"
                                    : "Movie"}
                                </span>
                                {mediaType !== "person" && <span>{year}</span>}
                                {item.vote_average > 0 && (
                                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {item.vote_average.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>

                          {mediaType !== "person" && (
                            <Link
                              href={
                                mediaType === "tv"
                                  ? `/watch/tv/${item.id}?season=1&episode=1`
                                  : `/watch/movie/${item.id}`
                              }
                              onClick={() => setSearchOpen(false)}
                              className="px-3 py-1.5 rounded-lg bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-md"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              Watch
                            </Link>
                          )}
                        </div>
                      );
                    })}

                    <Link
                      href={`/explore?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setSearchOpen(false)}
                      className="block text-center py-3 text-xs font-semibold text-[#e50914] hover:bg-white/5 transition-colors"
                    >
                      View all search results for &ldquo;{query}&rdquo; &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-400">
                    No movies or web series found for &ldquo;{query}&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 mx-4 p-4 rounded-2xl bg-[#10121b]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#e50914] text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
