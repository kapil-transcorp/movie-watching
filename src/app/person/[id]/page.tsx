import React from "react";
import { notFound } from "next/navigation";
import { User, Calendar, MapPin, Film } from "lucide-react";
import { getPersonDetails, getImageUrl, TMDBError } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import ErrorState from "@/components/ErrorState";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonDetailPage({ params }: PersonPageProps) {
  const { id } = await params;

  let person;
  try {
    person = await getPersonDetails(id);
  } catch (err) {
    if (err instanceof TMDBError && err.status === 404) {
      notFound();
    }
    return (
      <div className="pt-28 pb-16 px-4">
        <ErrorState
          title="Could Not Load Actor Profile"
          message={
            err instanceof Error
              ? err.message
              : "Temporary network error while loading this profile."
          }
          retryHref={`/person/${id}`}
        />
      </div>
    );
  }

  const avatar = getImageUrl(person.profile_path, "w500");
  const credits = (person.combined_credits?.cast || [])
    .filter((c) => c.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  // Deduplicate by id + media_type
  const seen = new Set<string>();
  const uniqueCredits = credits.filter((item) => {
    const key = `${item.media_type}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
      {/* Actor Bio Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10121b] border border-white/10 flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 shadow-2xl">
        <div className="w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/15 shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="space-y-4 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#e50914] text-white text-xs font-bold uppercase tracking-wider">
              {person.known_for_department || "Actor"}
            </span>
            {person.birthday && (
              <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {person.birthday}
              </span>
            )}
            {person.place_of_birth && (
              <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {person.place_of_birth}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {person.name}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line max-w-4xl">
            {person.biography ||
              `Explore movies and web series starring ${person.name}.`}
          </p>
        </div>
      </div>

      {/* Filmography Grid */}
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-1.5 h-6 rounded-full bg-[#e50914]" />
          <Film className="w-5 h-5 text-[#e50914]" />
          <h2 className="text-2xl font-bold text-white">
            Movies &amp; Web Series Starring {person.name} ({uniqueCredits.length})
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {uniqueCredits.slice(0, 40).map((item) => (
            <MediaCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              defaultType={item.media_type === "tv" ? "tv" : "movie"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
