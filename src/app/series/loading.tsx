import React from "react";
import { MediaGridShimmer } from "@/components/Skeletons";

export default function SeriesLoading() {
  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-10 w-72 rounded-2xl shimmer" />
          <div className="h-4 w-96 rounded-md shimmer" />
        </div>
        <div className="h-12 w-full md:w-[480px] rounded-2xl shimmer" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-xl shimmer shrink-0" />
          ))}
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-xl shimmer shrink-0" />
          ))}
        </div>
      </div>

      <MediaGridShimmer count={15} />
    </div>
  );
}
