"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import MediaCard from "./MediaCard";

interface MediaRowProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  defaultType?: "movie" | "tv";
  exploreHref?: string;
  ranked?: boolean;
}

export default function MediaRow({
  title,
  subtitle,
  items,
  defaultType = "movie",
  exploreHref,
  ranked = false,
}: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const offset = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
    rowRef.current.scrollTo({
      left: scrollLeft + offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-5 relative group/row">
      {/* Row Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 rounded-full bg-[#e50914]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-1 ml-4">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {exploreHref && (
            <Link
              href={exploreHref}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-[#e50914] flex items-center gap-1 transition-colors mr-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="p-2 rounded-full bg-white/5 hover:bg-[#e50914] border border-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="p-2 rounded-full bg-white/5 hover:bg-[#e50914] border border-white/10 text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={rowRef}
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {items.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="w-[155px] sm:w-[190px] md:w-[210px] shrink-0"
          >
            <MediaCard
              item={item}
              defaultType={defaultType}
              rank={ranked ? idx + 1 : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

