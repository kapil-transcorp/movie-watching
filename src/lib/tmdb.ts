export const TMDB_API_KEY =
  process.env.NEXT_PUBLIC_TMDB_API_KEY ||
  process.env.TMDB_API_KEY ||
  "15638d810569536e14666fdd49cd4d43";

export const TMDB_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN ||
  process.env.TMDB_ACCESS_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzOGQ4MTA1Njk1MzZlMTQ2NjZmZGQ0OWNkNGQ0MyIsIm5iZiI6MTc5MzE4NjA0MS4zMjgsInN1YiI6IjZhZTFkOGY5YzBjODYxMDQ4NzJiMTI3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sxCErqXJWHqBLbUnPwmp4S-GR1ywaQL98ggnHnzzza4";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export class TMDBError extends Error {
  status: number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "TMDBError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  profile_path?: string | null;
  media_type?: "movie" | "tv" | "person";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  original_language?: string;
  adult?: boolean;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface ReviewItem {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  vote_average?: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
}

export interface SeasonDetails {
  _id: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string | null;
  episodes: Episode[];
}

export interface MovieDetails extends MediaItem {
  tagline: string;
  runtime: number;
  status: string;
  budget: number;
  revenue: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id?: string | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  videos?: { results: VideoItem[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: MediaItem[] };
  recommendations?: { results: MediaItem[] };
  reviews?: { results: ReviewItem[] };
}

export interface TVDetails extends MediaItem {
  tagline: string;
  status: string;
  type: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  in_production: boolean;
  genres: Genre[];
  homepage: string | null;
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  seasons: SeasonSummary[];
  last_episode_to_air?: Episode | null;
  next_episode_to_air?: Episode | null;
  videos?: { results: VideoItem[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: MediaItem[] };
  recommendations?: { results: MediaItem[] };
  reviews?: { results: ReviewItem[] };
  external_ids?: {
    imdb_id?: string | null;
  };
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
  combined_credits?: {
    cast: (MediaItem & { character?: string; episode_count?: number })[];
    crew: (MediaItem & { job?: string; department?: string })[];
  };
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
  error?: string;
}

export const MOVIE_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const TV_GENRES: Genre[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

export const LANGUAGES = [
  { code: "", label: "All Languages" },
  { code: "en", label: "English (Hollywood)" },
  { code: "hi", label: "Hindi (Bollywood)" },
  { code: "ko", label: "Korean (K-Drama)" },
  { code: "ja", label: "Japanese (Anime / J-Cinema)" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ml", label: "Malayalam" },
  { code: "zh", label: "Chinese" },
  { code: "de", label: "German" },
  { code: "tr", label: "Turkish" },
];

export function getImageUrl(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" | "w1280" | "original" = "w500"
): string {
  if (!path) {
    return "";
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getMediaTitle(item: Partial<MediaItem>): string {
  return (
    item.title ||
    item.name ||
    item.original_title ||
    item.original_name ||
    "Untitled"
  );
}

export function getReleaseYear(item: Partial<MediaItem>): string {
  const dateStr = item.release_date || item.first_air_date;
  if (!dateStr) return "TBA";
  return dateStr.split("-")[0] || "TBA";
}

export function getMediaType(
  item: Partial<MediaItem>,
  fallback: "movie" | "tv" = "movie"
): "movie" | "tv" {
  if (item.media_type === "tv" || item.media_type === "movie") {
    return item.media_type;
  }
  if (item.first_air_date && !item.release_date) return "tv";
  if (item.name && !item.title) return "tv";
  return fallback;
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function getGenreNames(genreIds?: number[]): string[] {
  if (!genreIds || genreIds.length === 0) return [];
  const allGenres = [...MOVIE_GENRES, ...TV_GENRES];
  const map = new Map<number, string>();
  allGenres.forEach((g) => map.set(g.id, g.name));
  return genreIds
    .map((id) => map.get(id))
    .filter((name): name is string => Boolean(name))
    .slice(0, 3);
}

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = 1800,
  retries = 2
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  if (!params.language) {
    url.searchParams.set("language", "en-US");
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
        signal: controller.signal,
        next: { revalidate },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 404) {
          throw new TMDBError(`Resource not found: ${endpoint}`, 404, endpoint);
        }
        if ((res.status >= 500 || res.status === 429) && attempt < retries) {
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
          continue;
        }
        throw new TMDBError(
          `TMDB API Error (${res.status}) on ${endpoint}`,
          res.status,
          endpoint
        );
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      if (err instanceof TMDBError && err.status === 404) {
        throw err;
      }
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  }

  if (lastError instanceof TMDBError) {
    throw lastError;
  }

  throw new TMDBError(
    lastError instanceof Error
      ? lastError.message
      : `Failed to fetch TMDB endpoint: ${endpoint}`,
    503,
    endpoint
  );
}

const EMPTY_PAGE: PaginatedResponse<MediaItem> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "day",
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  try {
    return await fetchTMDB<PaginatedResponse<MediaItem>>(
      `/trending/${mediaType}/${timeWindow}`,
      { page }
    );
  } catch (err) {
    console.error("getTrending error:", err);
    return {
      ...EMPTY_PAGE,
      error: err instanceof Error ? err.message : "Failed to load trending",
    };
  }
}

export async function getMoviesByCategory(
  category: "popular" | "top_rated" | "now_playing" | "upcoming" = "popular",
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  try {
    const data = await fetchTMDB<PaginatedResponse<MediaItem>>(
      `/movie/${category}`,
      { page }
    );
    return {
      ...data,
      results: (data.results || []).map((item) => ({
        ...item,
        media_type: "movie",
      })),
    };
  } catch (err) {
    console.error(`getMoviesByCategory(${category}) error:`, err);
    return {
      ...EMPTY_PAGE,
      error: err instanceof Error ? err.message : "Failed to load movies",
    };
  }
}

export async function getTVByCategory(
  category: "popular" | "top_rated" | "on_the_air" | "airing_today" = "popular",
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  try {
    const data = await fetchTMDB<PaginatedResponse<MediaItem>>(
      `/tv/${category}`,
      { page }
    );
    return {
      ...data,
      results: (data.results || []).map((item) => ({
        ...item,
        media_type: "tv",
      })),
    };
  } catch (err) {
    console.error(`getTVByCategory(${category}) error:`, err);
    return {
      ...EMPTY_PAGE,
      error: err instanceof Error ? err.message : "Failed to load web series",
    };
  }
}

export async function getMovieDetails(
  id: string | number
): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${id}`, {
    append_to_response: "videos,credits,similar,recommendations,reviews",
  });
}

export async function getTVDetails(id: string | number): Promise<TVDetails> {
  return fetchTMDB<TVDetails>(`/tv/${id}`, {
    append_to_response:
      "videos,credits,similar,recommendations,reviews,external_ids",
  });
}

export async function getTVSeasonDetails(
  tvId: string | number,
  seasonNumber: number
): Promise<SeasonDetails> {
  return fetchTMDB<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getPersonDetails(
  id: string | number
): Promise<PersonDetails> {
  return fetchTMDB<PersonDetails>(`/person/${id}`, {
    append_to_response: "combined_credits",
  });
}

export interface DiscoverParams {
  type?: "movie" | "tv";
  genre?: string;
  sortBy?: string;
  year?: string;
  language?: string;
  minRating?: string;
  page?: number;
}

export async function discoverMedia({
  type = "movie",
  genre,
  sortBy = "popularity.desc",
  year,
  language,
  minRating,
  page = 1,
}: DiscoverParams): Promise<PaginatedResponse<MediaItem>> {
  const params: Record<string, string | number | undefined> = {
    sort_by: sortBy,
    include_adult: "false",
    page,
    with_genres: genre,
    with_original_language: language,
    "vote_average.gte": minRating,
    "vote_count.gte": minRating ? 50 : 10,
  };

  if (year) {
    if (type === "movie") {
      params.primary_release_year = year;
    } else {
      params.first_air_date_year = year;
    }
  }

  try {
    const data = await fetchTMDB<PaginatedResponse<MediaItem>>(
      `/discover/${type}`,
      params
    );

    return {
      ...data,
      results: (data.results || []).map((item) => ({
        ...item,
        media_type: type,
      })),
    };
  } catch (err) {
    console.error("discoverMedia error:", err);
    return {
      ...EMPTY_PAGE,
      error: err instanceof Error ? err.message : "Failed to discover media",
    };
  }
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  if (!query.trim()) {
    return EMPTY_PAGE;
  }
  try {
    return await fetchTMDB<PaginatedResponse<MediaItem>>(
      "/search/multi",
      {
        query: query.trim(),
        include_adult: "false",
        page,
      },
      300
    );
  } catch (err) {
    console.error("searchMulti error:", err);
    return {
      ...EMPTY_PAGE,
      error: err instanceof Error ? err.message : "Search failed",
    };
  }
}
