const JIOSAAVN_API = process.env.JIOSAAVN_API_URL || "https://saavn.dev/api";

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
  // Search
  searchSongs: (q: string, page = 1, limit = 20) =>
    fetchApi(`/search/songs?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchAlbums: (q: string, page = 1, limit = 20) =>
    fetchApi(`/search/albums?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchArtists: (q: string, page = 1, limit = 20) =>
    fetchApi(`/search/artists?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchPlaylists: (q: string, page = 1, limit = 20) =>
    fetchApi(`/search/playlists?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  searchAll: (q: string) => fetchApi(`/search?query=${encodeURIComponent(q)}`),

  // Songs
  getSong: (id: string) => fetchApi(`/songs/${id}`),
  getSongLyrics: (id: string) => fetchApi(`/songs/${id}/lyrics`),
  getSongSuggestions: (id: string, limit = 10) =>
    fetchApi(`/songs/${id}/suggestions?limit=${limit}`),

  // Albums
  getAlbum: (id: string) => fetchApi(`/albums?id=${id}`),

  // Artists
  getArtist: (id: string) => fetchApi(`/artists?id=${id}`),
  getArtistSongs: (id: string, page = 1) => fetchApi(`/artists/${id}/songs?page=${page}`),
  getArtistAlbums: (id: string, page = 1) => fetchApi(`/artists/${id}/albums?page=${page}`),

  // Playlists
  getPlaylist: (id: string, page = 1, limit = 50) =>
    fetchApi(`/playlists?id=${id}&page=${page}&limit=${limit}`),
};

export default jiosaavn;
