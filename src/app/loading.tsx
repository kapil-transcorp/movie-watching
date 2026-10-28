import React from "react";
import { HeroShimmer, MediaRowShimmer } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="pb-12">
      <HeroShimmer />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-4 flex gap-2.5 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-xl shimmer shrink-0" />
        ))}
      </div>
      <MediaRowShimmer titleWidth="w-64" />
      <MediaRowShimmer titleWidth="w-56" />
      <MediaRowShimmer titleWidth="w-72" />
      <MediaRowShimmer titleWidth="w-60" />
    </div>
  );
}
