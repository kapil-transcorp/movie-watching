import React from "react";

export function MediaCardShimmer() {
  return (
    <div className="flex flex-col select-none">
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shimmer border border-white/10 shadow-lg">
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="w-12 h-4 rounded-md bg-white/10" />
          <div className="w-10 h-4 rounded-md bg-white/10" />
        </div>
      </div>
      <div className="mt-2.5 space-y-1.5 px-0.5">
        <div className="h-4 w-4/5 rounded-md shimmer" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-10 rounded-md shimmer" />
          <div className="h-3 w-12 rounded-md shimmer" />
        </div>
      </div>
    </div>
  );
}

export function MediaRowShimmer({ titleWidth = "w-56" }: { titleWidth?: string }) {
  return (
    <section className="py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-4 flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 rounded-full bg-[#e50914]/50" />
            <div className={`h-7 ${titleWidth} rounded-lg shimmer`} />
          </div>
          <div className="h-3.5 w-72 rounded-md shimmer ml-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full shimmer" />
          <div className="w-8 h-8 rounded-full shimmer" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-4 sm:gap-5 overflow-hidden pb-2">
        {[...Array(7)].map((_, idx) => (
          <div
            key={idx}
            className="w-[155px] sm:w-[190px] md:w-[210px] shrink-0"
          >
            <MediaCardShimmer />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeroShimmer() {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[760px] flex items-end pb-12 sm:pb-16 overflow-hidden bg-[#0a0c14]">
      <div className="absolute inset-0 shimmer opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080d] via-[#07080d]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-transparent to-black/50" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 w-full pt-28 flex flex-col lg:flex-row items-end justify-between gap-8">
        <div className="max-w-2xl w-full space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-28 rounded-full shimmer" />
            <div className="h-6 w-24 rounded-full shimmer" />
            <div className="h-6 w-20 rounded-full shimmer" />
          </div>
          <div className="h-12 sm:h-16 w-4/5 rounded-2xl shimmer" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 rounded-full shimmer" />
            <div className="h-6 w-20 rounded-full shimmer" />
            <div className="h-6 w-16 rounded-full shimmer" />
          </div>
          <div className="space-y-2 max-w-xl">
            <div className="h-4 w-full rounded-md shimmer" />
            <div className="h-4 w-11/12 rounded-md shimmer" />
            <div className="h-4 w-2/3 rounded-md shimmer" />
          </div>
          <div className="pt-2 flex items-center gap-3.5">
            <div className="h-12 w-48 rounded-2xl shimmer" />
            <div className="h-12 w-40 rounded-2xl shimmer" />
            <div className="h-12 w-12 rounded-2xl shimmer" />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-16 h-24 rounded-xl shimmer border border-white/10" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MediaGridShimmer({ count = 15 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {[...Array(count)].map((_, idx) => (
        <MediaCardShimmer key={idx} />
      ))}
    </div>
  );
}

export function EpisodeCardShimmer() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#121521] border border-white/10 flex flex-col">
      <div className="aspect-video w-full shimmer" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-3/4 rounded-md shimmer" />
        <div className="h-3 w-full rounded-md shimmer" />
        <div className="h-3 w-2/3 rounded-md shimmer" />
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <div className="h-3 w-20 rounded-md shimmer" />
          <div className="h-3 w-10 rounded-md shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SearchDropdownShimmer() {
  return (
    <div className="p-3 space-y-2.5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02]">
          <div className="w-11 h-16 rounded-lg shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-md shimmer" />
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-16 rounded shimmer" />
              <div className="h-3.5 w-10 rounded shimmer" />
            </div>
          </div>
          <div className="w-16 h-7 rounded-lg shimmer shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function DetailBannerShimmer() {
  return (
    <div className="pb-16">
      <div className="relative min-h-[560px] lg:min-h-[660px] flex items-end pb-12 overflow-hidden bg-[#0a0c14]">
        <div className="absolute inset-0 shimmer opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/60 to-black/50" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 w-full flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="w-52 sm:w-64 aspect-[2/3] rounded-2xl shimmer border-2 border-white/10 shrink-0" />
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-24 rounded-full shimmer" />
              <div className="h-6 w-28 rounded-full shimmer" />
              <div className="h-6 w-20 rounded-full shimmer" />
            </div>
            <div className="h-12 w-3/4 rounded-2xl shimmer" />
            <div className="h-4 w-1/2 rounded-md shimmer" />
            <div className="flex gap-2">
              <div className="h-7 w-20 rounded-full shimmer" />
              <div className="h-7 w-24 rounded-full shimmer" />
              <div className="h-7 w-20 rounded-full shimmer" />
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-4 w-full rounded-md shimmer" />
              <div className="h-4 w-5/6 rounded-md shimmer" />
              <div className="h-4 w-2/3 rounded-md shimmer" />
            </div>
            <div className="pt-3 flex gap-3.5">
              <div className="h-14 w-56 rounded-2xl shimmer" />
              <div className="h-14 w-48 rounded-2xl shimmer" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 space-y-8">
        <div className="h-7 w-48 rounded-lg shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <EpisodeCardShimmer key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WatchRoomShimmer() {
  return (
    <div className="pt-24 pb-16 min-h-screen max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-44 rounded-xl shimmer" />
        <div className="h-6 w-36 rounded-lg shimmer" />
      </div>

      <div className="h-16 w-full rounded-2xl shimmer border border-white/10" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-4">
          <div className="aspect-video w-full rounded-2xl shimmer border border-white/15" />
          <div className="p-5 rounded-2xl bg-[#10121b] border border-white/10 space-y-3">
            <div className="h-5 w-48 rounded-md shimmer" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl shimmer" />
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 rounded-2xl bg-[#10121b] border border-white/10 p-4 space-y-3">
          <div className="h-10 w-full rounded-xl shimmer" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 w-full rounded-xl shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
