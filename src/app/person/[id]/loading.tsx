import React from "react";
import { MediaGridShimmer } from "@/components/Skeletons";

export default function PersonLoading() {
  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10121b] border border-white/10 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 sm:w-56 aspect-[2/3] rounded-2xl shimmer shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full shimmer" />
            <div className="h-6 w-32 rounded-full shimmer" />
          </div>
          <div className="h-12 w-64 rounded-2xl shimmer" />
          <div className="space-y-2.5">
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-11/12 rounded shimmer" />
            <div className="h-4 w-4/5 rounded shimmer" />
            <div className="h-4 w-2/3 rounded shimmer" />
          </div>
        </div>
      </div>

      <MediaGridShimmer count={10} />
    </div>
  );
}
