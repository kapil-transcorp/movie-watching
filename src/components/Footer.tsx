import React from "react";
import Link from "next/link";
import { Play, Film, Tv, Compass, Bookmark, ShieldCheck, Sparkles } from "lucide-react";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/tmdb";

export default function Footer() {
  return (
    <footer className="bg-[#05060a] border-t border-white/10 mt-20 text-slate-400">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e50914] to-rose-700 flex items-center justify-center shadow-lg shadow-[#e50914]/30">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                CINE<span className="text-[#e50914]">VERSE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Your ultimate cinema destination to discover, track, and stream
              blockbuster Movies, binge-worthy Web Series, Anime, K-Dramas, and
              Global Originals in ultra-crisp HD.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Multi-Server Streaming
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Powered by TMDB API
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Browse
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#e50914]" /> Home Spotlight
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-white transition-colors flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-[#e50914]" /> All Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-white transition-colors flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-[#e50914]" /> Web Series &amp; TV
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#e50914]" /> Advanced Filter
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-white transition-colors flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-[#e50914]" /> My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Movie Genres */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Movie Genres
            </h3>
            <ul className="space-y-2 text-sm">
              {MOVIE_GENRES.slice(0, 6).map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/movies?genre=${g.id}`}
                    className="hover:text-white transition-colors"
                  >
                    {g.name} Movies
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Web Series Genres */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Web Series
            </h3>
            <ul className="space-y-2 text-sm">
              {TV_GENRES.slice(0, 6).map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/series?genre=${g.id}`}
                    className="hover:text-white transition-colors"
                  >
                    {g.name} Series
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CineVerse Streaming Platform. Built
            with Next.js &amp; TMDB API.
          </p>
          <p>
            Metadata &amp; artwork provided by The Movie Database (TMDB).
          </p>
        </div>
      </div>
    </footer>
  );
}

