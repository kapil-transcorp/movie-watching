"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Server,
  Tv,
  Film,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  SkipForward,
  SkipBack,
  MonitorPlay,
  CheckCircle2,
  Clock,
  Star,
  Bookmark,
  Check,
  Loader2,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import {
  Episode,
  SeasonSummary,
  getImageUrl,
  formatRuntime,
} from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface StreamingPlayerProps {
  id: number;
  imdbId?: string | null;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseDate?: string;
  seasons?: SeasonSummary[];
  initialSeason?: number;
  initialEpisode?: number;
  initialEpisodes?: Episode[];
}

interface StreamServer {
  id: string;
  name: string;
  badge: string;
  getUrl: (
    id: number,
    mediaType: "movie" | "tv",
    season: number,
    episode: number,
    imdbId?: string | null
  ) => string;
}

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: "vidsrc_xyz",
    name: "VidSrc Pro",
    badge: "Server 1 • Fast HD",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://vidsrc.xyz/embed/tv/${id}/${s}-${e}`
        : `https://vidsrc.xyz/embed/movie/${id}`,
  },
  {
    id: "vidsrc_pm",
    name: "VidSrc PM",
    badge: "Server 2 • 1080p",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://vidsrc.pm/embed/tv/${id}/${s}-${e}`
        : `https://vidsrc.pm/embed/movie/${id}`,
  },
  {
    id: "vidsrc_in",
    name: "VidSrc IN",
    badge: "Server 3 • India CDN",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://vidsrc.in/embed/tv/${id}/${s}-${e}`
        : `https://vidsrc.in/embed/movie/${id}`,
  },
  {
    id: "vidsrc_net",
    name: "VidSrc Net",
    badge: "Server 4 • Global HD",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://vidsrc.net/embed/tv/${id}/${s}-${e}`
        : `https://vidsrc.net/embed/movie/${id}`,
  },
  {
    id: "multiembed",
    name: "MultiEmbed VIP",
    badge: "Server 5 • Multi-Audio",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed HD",
    badge: "Server 6 • Multi-Sub",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`
        : `https://player.autoembed.cc/embed/movie/${id}`,
  },
  {
    id: "twoembed",
    name: "2Embed Stream",
    badge: "Server 7 • Backup HD",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
        : `https://www.2embed.cc/embed/${id}`,
  },
  {
    id: "moviesapi",
    name: "MoviesAPI Club",
    badge: "Server 8 • 4K UHD",
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://moviesapi.club/tv/${id}-${s}-${e}`
        : `https://moviesapi.club/movie/${id}`,
  },
];

export default function StreamingPlayer({
  id,
  imdbId,
  mediaType,
  title,
  posterPath,
  backdropPath,
  voteAverage,
  releaseDate,
  seasons = [],
  initialSeason = 1,
  initialEpisode = 1,
  initialEpisodes = [],
}: StreamingPlayerProps) {
  const router = useRouter();
  const { addToHistory, isInWatchlist, toggleWatchlist } = useWatchlist();

  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedServer, setSelectedServer] = useState<string>("vidsrc_xyz");
  const [adShield, setAdShield] = useState<boolean>(false);
  const [season, setSeason] = useState<number>(initialSeason);
  const [episode, setEpisode] = useState<number>(initialEpisode);
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [episodeError, setEpisodeError] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [lightsOff, setLightsOff] = useState<boolean>(false);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);

  // Sync season/episode when props change
  useEffect(() => {
    setSeason(initialSeason);
    setEpisode(initialEpisode);
  }, [initialSeason, initialEpisode]);

  // Trigger player loader whenever server, season, or episode changes
  useEffect(() => {
    setIframeLoading(true);
    const fallbackTimer = setTimeout(() => {
      setIframeLoading(false);
    }, 2500);
    return () => clearTimeout(fallbackTimer);
  }, [selectedServer, season, episode, adShield]);

  const loadSeasonEpisodes = useCallback(
    async (targetSeason: number) => {
      if (mediaType !== "tv") return;
      setLoadingEpisodes(true);
      setEpisodeError(null);
      try {
        const res = await fetch(
          `/api/tmdb/season?tvId=${id}&season=${targetSeason}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load Season ${targetSeason} episodes`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEpisodes(data.episodes || []);
      } catch (err) {
        setEpisodeError(
          err instanceof Error
            ? err.message
            : "Could not load episode list for this season."
        );
      } finally {
        setLoadingEpisodes(false);
      }
    },
    [id, mediaType]
  );

  useEffect(() => {
    if (mediaType !== "tv") return;
    loadSeasonEpisodes(season);
  }, [mediaType, season, loadSeasonEpisodes]);

  const currentEpisodeObj = episodes.find(
    (ep) => ep.episode_number === episode
  );

  // Save to Continue Watching History
  useEffect(() => {
    addToHistory({
      id,
      media_type: mediaType,
      title,
      poster_path: posterPath,
      backdrop_path: backdropPath,
      vote_average: voteAverage,
      release_date: releaseDate,
      season: mediaType === "tv" ? season : undefined,
      episode: mediaType === "tv" ? episode : undefined,
      episodeTitle: currentEpisodeObj?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mediaType, season, episode, currentEpisodeObj?.name]);

  const handleEpisodeSelect = (newSeason: number, newEpisode: number) => {
    setSeason(newSeason);
    setEpisode(newEpisode);
    router.replace(
      `/watch/tv/${id}?season=${newSeason}&episode=${newEpisode}`,
      { scroll: false }
    );
  };

  const currentServerObj =
    STREAM_SERVERS.find((s) => s.id === selectedServer) || STREAM_SERVERS[0];

  const embedUrl = currentServerObj.getUrl(
    id,
    mediaType,
    season,
    episode,
    imdbId
  );
  const saved = isInWatchlist(id, mediaType);

  return (
    <div className="relative">
      {/* Lights Off Overlay */}
      {lightsOff && (
        <div
          onClick={() => setLightsOff(false)}
          className="fixed inset-0 bg-black/90 z-40 transition-opacity cursor-pointer"
        />
      )}

      <div
        className={`relative z-40 transition-all duration-300 ${
          theaterMode
            ? "max-w-full px-2 sm:px-6"
            : "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10"
        }`}
      >
        {/* Top Bar: Now Playing Status & Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-[#10121b] border border-white/10 rounded-2xl p-3.5 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914] shrink-0">
              {mediaType === "tv" ? (
                <Tv className="w-5 h-5" />
              ) : (
                <Film className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#e50914] text-white">
                  Now Streaming
                </span>
                {mediaType === "tv" && (
                  <span className="text-xs font-bold text-amber-400">
                    Season {season} &bull; Episode {episode}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  &bull; {currentServerObj.name}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                {title}
                {mediaType === "tv" && currentEpisodeObj?.name
                  ? ` — "${currentEpisodeObj.name}"`
                  : ""}
              </h2>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {mediaType === "tv" && (
              <>
                <button
                  type="button"
                  disabled={episode <= 1}
                  onClick={() => handleEpisodeSelect(season, episode - 1)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-40 text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                  Prev Ep
                </button>
                <button
                  type="button"
                  disabled={
                    episodes.length > 0 && episode >= episodes.length
                  }
                  onClick={() => handleEpisodeSelect(season, episode + 1)}
                  className="px-3 py-2 rounded-xl bg-[#e50914] hover:bg-[#f6121d] disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-colors"
                >
                  Next Ep
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Ad-Shield Sandbox Toggle */}
            <button
              type="button"
              onClick={() => setAdShield(!adShield)}
              title="Toggle strict iframe sandbox if a server shows popups"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                adShield
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 hover:bg-white/15 border-white/10 text-slate-300"
              }`}
            >
              {adShield ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" /> Sandbox: ON
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" /> Sandbox: OFF
                </>
              )}
            </button>

            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-white/10 transition-colors"
              title="Open stream directly in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Direct Tab</span>
            </a>

            <button
              type="button"
              onClick={() =>
                toggleWatchlist({
                  id,
                  media_type: mediaType,
                  title,
                  name: title,
                  overview: "",
                  poster_path: posterPath,
                  backdrop_path: backdropPath,
                  vote_average: voteAverage,
                  vote_count: 100,
                  popularity: 100,
                })
              }
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                saved
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 hover:bg-white/15 border-white/10 text-slate-200"
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" /> + Watchlist
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setTheaterMode(!theaterMode)}
              className="hidden md:flex px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-semibold text-slate-200 items-center gap-1.5 border border-white/10 transition-colors"
            >
              {theaterMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> Default View
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> Theater Mode
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setLightsOff(!lightsOff)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                lightsOff
                  ? "bg-amber-500 text-black border-amber-400 font-bold"
                  : "bg-white/5 hover:bg-white/15 text-slate-200 border-white/10"
              }`}
            >
              {lightsOff ? (
                <>
                  <Sun className="w-3.5 h-3.5" /> Lights On
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" /> Lights Off
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Grid: Video Player + (For Web Series) Episode Sidebar */}
        <div
          className={`grid grid-cols-1 ${
            mediaType === "tv" && !theaterMode ? " xl:grid-cols-12" : ""
          } gap-6`}
        >
          {/* Left / Main Column: Video Frame + Server Switcher */}
          <div
            className={`${
              mediaType === "tv" && !theaterMode ? "xl:col-span-8" : "w-full"
            } space-y-4`}
          >
            {/* Video Player Container with Ambient Glow & Shimmer Loader */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_0_70px_-15px_rgba(229,9,20,0.35)] aspect-video w-full">
              {/* Shimmer & Spinner Overlay while Server Connects */}
              {iframeLoading && (
                <div className="absolute inset-0 z-20 bg-[#07080d]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    Connecting to {currentServerObj.name} (
                    {currentServerObj.badge})...
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    Loading full{" "}
                    {mediaType === "tv"
                      ? `episode (${title} — S${season}:E${episode})`
                      : `movie (${title})`}{" "}
                    stream...
                  </p>
                </div>
              )}

              <iframe
                key={`${selectedServer}-${id}-${season}-${episode}-${adShield}`}
                src={embedUrl}
                title={`${title} Full Stream Player`}
                onLoad={() => setIframeLoading(false)}
                sandbox={
                  adShield
                    ? "allow-scripts allow-same-origin allow-forms allow-presentation"
                    : undefined
                }
                className="w-full h-full border-0 relative z-10"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="origin"
              />
            </div>

            {/* Multi-Server Switcher Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#10121b] border border-white/10 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#e50914]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Full Movie &amp; Series Streaming Servers (TMDB Direct)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  If one server is slow or unavailable in your region, click
                  another server below:
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STREAM_SERVERS.map((srv) => {
                  const active = selectedServer === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedServer(srv.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                        active
                          ? "bg-gradient-to-r from-[#e50914] to-rose-700 border-rose-400/50 text-white shadow-lg shadow-[#e50914]/25"
                          : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <MonitorPlay className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs font-bold truncate">
                            {srv.name}
                          </span>
                        </div>
                        <span
                          className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            active
                              ? "bg-black/30 text-white"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          {srv.badge}
                        </span>
                      </div>
                      {active && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (For Web Series): Season & Episode Selector Playlist */}
          {mediaType === "tv" && (
            <div
              className={`${
                theaterMode ? "w-full" : "xl:col-span-4"
              } flex flex-col bg-[#10121b] border border-white/10 rounded-2xl overflow-hidden max-h-[680px]`}
            >
              {/* Season Selector Header */}
              <div className="p-4 border-b border-white/10 bg-[#151824] flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    Episodes Guide
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {loadingEpisodes
                      ? `Loading Season ${season}...`
                      : `${episodes.length} Episodes in Season ${season}`}
                  </p>
                </div>

                {validSeasons.length > 0 && (
                  <select
                    value={season}
                    onChange={(e) =>
                      handleEpisodeSelect(Number(e.target.value), 1)
                    }
                    className="bg-[#07080d] text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-[#e50914]"
                  >
                    {validSeasons.map((s) => (
                      <option key={s.id} value={s.season_number}>
                        Season {s.season_number} ({s.episode_count} Eps)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Episodes Scroll List with Shimmer & Error Handling */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loadingEpisodes ? (
                  <div className="space-y-2.5 p-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-white/5 flex gap-3 items-center bg-white/[0.02]"
                      >
                        <div className="w-28 aspect-video rounded-lg shimmer shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-3/4 rounded shimmer" />
                          <div className="h-2.5 w-full rounded shimmer" />
                          <div className="h-2.5 w-1/2 rounded shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : episodeError ? (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-rose-300">
                      {episodeError}
                    </p>
                    <button
                      type="button"
                      onClick={() => loadSeasonEpisodes(season)}
                      className="px-4 py-2 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Season {season}
                    </button>
                  </div>
                ) : episodes.length > 0 ? (
                  episodes.map((ep) => {
                    const isCurrent = ep.episode_number === episode;
                    const still = getImageUrl(ep.still_path, "w342");

                    return (
                      <button
                        key={ep.id}
                        type="button"
                        onClick={() =>
                          handleEpisodeSelect(season, ep.episode_number)
                        }
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex gap-3 items-center group ${
                          isCurrent
                            ? "bg-[#e50914]/15 border-[#e50914] shadow-md"
                            : "bg-white/[0.03] hover:bg-white/[0.07] border-white/5"
                        }`}
                      >
                        {/* Episode Still Thumbnail */}
                        <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                          {still ? (
                            <img
                              src={still}
                              alt={ep.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Tv className="w-5 h-5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isCurrent
                                  ? "bg-[#e50914] text-white"
                                  : "bg-black/70 text-white group-hover:bg-[#e50914]"
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-bold text-white">
                            EP {ep.episode_number}
                          </span>
                        </div>

                        {/* Episode Metadata */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs font-bold truncate ${
                                isCurrent ? "text-[#e50914]" : "text-white"
                              }`}
                            >
                              {ep.episode_number}. {ep.name}
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {ep.overview || "Stream full episode in HD."}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                            {ep.runtime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRuntime(ep.runtime)}
                              </span>
                            )}
                            {ep.vote_average > 0 && (
                              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {ep.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No episode metadata available for Season {season}.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
