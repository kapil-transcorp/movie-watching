"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Compass, WifiOff } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryHref?: string;
  compact?: boolean;
}

export default function ErrorState({
  title = "Unable to Load Content",
  message = "We encountered a temporary issue connecting to the TMDB streaming catalog. Please check your connection or try refreshing.",
  onRetry,
  retryHref,
  compact = false,
}: ErrorStateProps) {
  if (compact) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{message}</p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#10121b] border border-rose-500/30 max-w-2xl mx-auto my-10 text-center space-y-5 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-[#e50914]">
        <WifiOff className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">{title}</h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#e50914]/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        ) : retryHref ? (
          <Link
            href={retryHref}
            className="px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#e50914]/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#e50914]/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        )}

        <Link
          href="/"
          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold flex items-center gap-2 border border-white/10 transition-all"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>

        <Link
          href="/explore"
          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold flex items-center gap-2 border border-white/10 transition-all"
        >
          <Compass className="w-4 h-4" />
          Explore
        </Link>
      </div>
    </div>
  );
}
