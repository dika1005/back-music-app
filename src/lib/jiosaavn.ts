const JIOSAAVN_API = process.env.JIOSAAVN_API_URL || "https://saavn.sumit.co/api";

// Type definitions for API responses
export interface SearchResult<T = unknown> {
  total: number;
  start: number;
  results: T[];
}

export interface ImageQuality {
  quality: string;
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  role?: string;
  type: string;
  image: ImageQuality[];
  url: string;
}

export interface Song {
  id: string;
  name: string;
  type: string;
  year?: string | null;
  releaseDate?: string | null;
  duration?: number | null;
  label?: string | null;
  explicitContent: boolean;
  playCount?: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId?: string | null;
  url: string;
  copyright?: string | null;
  album?: {
    id: string | null;
    name: string | null;
    url: string | null;
  };
  artists?: {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
  };
  image: ImageQuality[];
  downloadUrl?: ImageQuality[];
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  year?: string | null;
  type: string;
  playCount?: number | null;
  language: string;
  explicitContent: boolean;
  artists?: {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
  };
  songCount?: number | null;
  url: string;
  image: ImageQuality[];
  songs?: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  type: string;
  image: ImageQuality[];
  url: string;
  songCount?: number | null;
  language: string;
  explicitContent: boolean;
}

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${JIOSAAVN_API}${endpoint}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export const jiosaavn = {
  // Search - API uses 0-indexed pages
  searchSongs: (q: string, page = 0, limit = 10) =>
    fetchApi<SearchResult<Song>>(`/search/songs?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchAlbums: (q: string, page = 0, limit = 10) =>
    fetchApi<SearchResult<Album>>(`/search/albums?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchArtists: (q: string, page = 0, limit = 10) =>
    fetchApi<SearchResult<Artist>>(`/search/artists?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchPlaylists: (q: string, page = 0, limit = 10) =>
    fetchApi<SearchResult<Playlist>>(`/search/playlists?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchAll: (q: string) => fetchApi(`/search?query=${encodeURIComponent(q)}`),

  // Songs
  getSong: (id: string) => fetchApi<Song[]>(`/songs/${id}`),
  getSongsByIds: (ids: string[]) => fetchApi<Song[]>(`/songs?ids=${ids.join(",")}`),
  getSongByLink: (link: string) => fetchApi<Song[]>(`/songs?link=${encodeURIComponent(link)}`),
  getSongSuggestions: (id: string, limit = 10) =>
    fetchApi<Song[]>(`/songs/${id}/suggestions?limit=${limit}`),

  // Albums
  getAlbum: (id: string) => fetchApi<Album>(`/albums?id=${id}`),
  getAlbumByLink: (link: string) => fetchApi<Album>(`/albums?link=${encodeURIComponent(link)}`),

  // Artists - API uses 0-indexed pages
  getArtist: (id: string, options?: { page?: number; songCount?: number; albumCount?: number; sortBy?: string; sortOrder?: string }) => {
    const params = new URLSearchParams();
    params.set("id", id);
    if (options?.page !== undefined) params.set("page", options.page.toString());
    if (options?.songCount !== undefined) params.set("songCount", options.songCount.toString());
    if (options?.albumCount !== undefined) params.set("albumCount", options.albumCount.toString());
    if (options?.sortBy) params.set("sortBy", options.sortBy);
    if (options?.sortOrder) params.set("sortOrder", options.sortOrder);
    return fetchApi(`/artists?${params.toString()}`);
  },
  getArtistById: (id: string, options?: { page?: number; songCount?: number; albumCount?: number; sortBy?: string; sortOrder?: string }) => {
    const params = new URLSearchParams();
    if (options?.page !== undefined) params.set("page", options.page.toString());
    if (options?.songCount !== undefined) params.set("songCount", options.songCount.toString());
    if (options?.albumCount !== undefined) params.set("albumCount", options.albumCount.toString());
    if (options?.sortBy) params.set("sortBy", options.sortBy);
    if (options?.sortOrder) params.set("sortOrder", options.sortOrder);
    return fetchApi(`/artists/${id}?${params.toString()}`);
  },
  getArtistSongs: (id: string, page = 0, sortBy = "popularity", sortOrder = "desc") =>
    fetchApi(`/artists/${id}/songs?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`),
  getArtistAlbums: (id: string, page = 0, sortBy = "popularity", sortOrder = "desc") =>
    fetchApi(`/artists/${id}/albums?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`),

  // Playlists - API uses 0-indexed pages
  getPlaylist: (id: string, page = 0, limit = 10) =>
    fetchApi(`/playlists?id=${id}&page=${page}&limit=${limit}`),
  getPlaylistByLink: (link: string, page = 0, limit = 10) =>
    fetchApi(`/playlists?link=${encodeURIComponent(link)}&page=${page}&limit=${limit}`),
};

export default jiosaavn;

