import React from "react";
import { MediaGridShimmer } from "@/components/Skeletons";

export default function ExploreLoading() {
  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
      <div className="space-y-2.5">
        <div className="h-10 w-72 rounded-2xl shimmer" />
        <div className="h-4 w-96 rounded-md shimmer" />
      </div>

      <div className="h-40 w-full rounded-2xl shimmer border border-white/10" />

      <MediaGridShimmer count={15} />
    </div>
  );
}
