import React from "react";
import Link from "next/link";
import { Film, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center text-[#e50914] mb-6">
        <Film className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-white mb-2">
        Title Not Found (404)
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        We couldn&apos;t find the movie or web series you were looking for. It
        may have been moved or removed from TMDB.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-sm font-bold flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-bold flex items-center gap-2"
        >
          <Compass className="w-4 h-4" /> Explore Catalog
        </Link>
      </div>
    </div>
  );
}

