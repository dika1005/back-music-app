import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

// Feed categories with popular search terms for each language/genre
const FEED_CATEGORIES = {
  trending: ["trending viral", "top hits 2024", "popular songs"],
  english: ["taylor swift", "ed sheeran", "the weeknd", "dua lipa", "pop hits"],
  hindi: ["arijit singh", "bollywood hits", "hindi romantic"],
  punjabi: ["punjabi hits", "diljit dosanjh", "ap dhillon"],
  tamil: ["tamil hits", "anirudh", "tamil melody"],
  telugu: ["telugu hits", "dsp hits", "telugu romantic"],
  korean: ["kpop", "bts", "blackpink"],
  indonesian: ["indonesian hits", "pop indonesia", "dangdut"],
};

const POPULAR_PLAYLIST_IDS = [
  "82914609", // Its Indie English
  "1134653986", // Today's Top Hits
  "110858205", // Bollywood Butter
];

export const feedRoutes = new Elysia({ prefix: "/feed", tags: ["Feed"] })
  // Get homepage feed
  .get(
    "/",
    async ({ query }) => {
      const language = query.language || "english";
      const limit = parseInt(query.limit || "10");

      try {
        // Get trending songs
        const trendingPromise = jiosaavn.searchSongs("trending hits", 0, limit);

        // Get new releases
        const newReleasesPromise = jiosaavn.searchSongs("new release 2024", 0, limit);

        // Get songs based on language preference
        const languageTerms = FEED_CATEGORIES[language as keyof typeof FEED_CATEGORIES] || FEED_CATEGORIES.english;
        const languageSongsPromise = jiosaavn.searchSongs(languageTerms[0], 0, limit);

        // Get popular artists
        const artistsPromise = jiosaavn.searchArtists("popular", 0, 6);

        // Get albums
        const albumsPromise = jiosaavn.searchAlbums("top albums", 0, 6);

        const [trending, newReleases, languageSongs, artists, albums] = await Promise.all([
          trendingPromise,
          newReleasesPromise,
          languageSongsPromise,
          artistsPromise,
          albumsPromise,
        ]);

        return {
          success: true,
          data: {
            trending: {
              title: "Trending Now 🔥",
              type: "songs",
              items: trending?.results || [],
            },
            newReleases: {
              title: "New Releases ✨",
              type: "songs",
              items: newReleases?.results || [],
            },
            forYou: {
              title: `Top ${language.charAt(0).toUpperCase() + language.slice(1)} Songs`,
              type: "songs",
              items: languageSongs?.results || [],
            },
            artists: {
              title: "Popular Artists 🎤",
              type: "artists",
              items: artists?.results || [],
            },
            albums: {
              title: "Top Albums 💿",
              type: "albums",
              items: albums?.results || [],
            },
          },
        };
      } catch (error) {
        return { success: false, error: "Failed to fetch feed" };
      }
    },
    {
      detail: {
        summary: "Get homepage feed",
        description: "Returns curated content for the homepage including trending, new releases, and more",
      },
    }
  )

  // Get trending songs
  .get(
    "/trending",
    async ({ query }) => {
      const limit = parseInt(query.limit || "20");
      const page = parseInt(query.page || "0");

      const data = await jiosaavn.searchSongs("trending hits viral", page, limit);
      return {
        success: true,
        data: {
          title: "Trending Now 🔥",
          items: data?.results || [],
          total: data?.total || 0,
        },
      };
    },
    { detail: { summary: "Get trending songs" } }
  )

  // Get new releases
  .get(
    "/new-releases",
    async ({ query }) => {
      const limit = parseInt(query.limit || "20");
      const page = parseInt(query.page || "0");

      const data = await jiosaavn.searchSongs("new release 2024 2025", page, limit);
      return {
        success: true,
        data: {
          title: "New Releases ✨",
          items: data?.results || [],
          total: data?.total || 0,
        },
      };
    },
    { detail: { summary: "Get new releases" } }
  )

  // Get songs by language/genre
  .get(
    "/by-language/:language",
    async ({ params, query }) => {
      const { language } = params;
      const limit = parseInt(query.limit || "20");
      const page = parseInt(query.page || "0");

      const terms = FEED_CATEGORIES[language as keyof typeof FEED_CATEGORIES];
      if (!terms) {
        return { success: false, error: "Invalid language. Supported: hindi, english, punjabi, tamil, telugu" };
      }

      const searchTerm = terms[Math.floor(Math.random() * terms.length)];
      const data = await jiosaavn.searchSongs(searchTerm, page, limit);

      return {
        success: true,
        data: {
          title: `${language.charAt(0).toUpperCase() + language.slice(1)} Hits`,
          language,
          items: data?.results || [],
          total: data?.total || 0,
        },
      };
    },
    { detail: { summary: "Get songs by language" } }
  )

  // Get featured playlists
  .get(
    "/playlists",
    async ({ query }) => {
      const limit = parseInt(query.limit || "10");

      // Search for popular playlists
      const [bollywood, english, workout, romantic] = await Promise.all([
        jiosaavn.searchPlaylists("bollywood hits", 0, 4),
        jiosaavn.searchPlaylists("english pop", 0, 4),
        jiosaavn.searchPlaylists("workout gym", 0, 4),
        jiosaavn.searchPlaylists("romantic love", 0, 4),
      ]);

      return {
        success: true,
        data: {
          categories: [
            { title: "Bollywood", items: bollywood?.results || [] },
            { title: "English", items: english?.results || [] },
            { title: "Workout", items: workout?.results || [] },
            { title: "Romantic", items: romantic?.results || [] },
          ],
        },
      };
    },
    { detail: { summary: "Get featured playlists" } }
  )

  // Get top artists
  .get(
    "/artists",
    async ({ query }) => {
      const limit = parseInt(query.limit || "20");
      const page = parseInt(query.page || "0");

      const data = await jiosaavn.searchArtists("popular singer", page, limit);
      return {
        success: true,
        data: {
          title: "Top Artists 🎤",
          items: data?.results || [],
          total: data?.total || 0,
        },
      };
    },
    { detail: { summary: "Get top artists" } }
  )

  // Get charts/top songs
  .get(
    "/charts",
    async ({ query }) => {
      const chart = query.chart || "english";
      const limit = parseInt(query.limit || "50");

      const chartQueries: Record<string, string> = {
        english: "billboard hot 100 top hits",
        pop: "pop hits 2024",
        hiphop: "hip hop rap hits",
        rock: "rock hits classic",
        edm: "edm dance electronic",
        bollywood: "bollywood top hits",
        punjabi: "punjabi top hits",
        tamil: "tamil top hits",
        telugu: "telugu top hits",
        kpop: "kpop bts blackpink",
      };

      const searchTerm = chartQueries[chart] || chartQueries.english;
      const data = await jiosaavn.searchSongs(searchTerm, 0, limit);

      return {
        success: true,
        data: {
          title: `${chart.charAt(0).toUpperCase() + chart.slice(1)} Chart`,
          chart,
          items: data?.results || [],
          total: data?.total || 0,
        },
      };
    },
    { detail: { summary: "Get chart/top songs by category" } }
  );

export default feedRoutes;
