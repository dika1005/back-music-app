import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const searchRoutes = new Elysia({ prefix: "/search", tags: ["Search"] })
  .get(
    "/",
    async ({ query }) => {
      const { q } = query;
      if (!q) return { success: false, error: "Query required" };
      const data = await jiosaavn.searchAll(q);
      return { success: true, data };
    },
    { detail: { summary: "Search all (songs, albums, artists, playlists)" } }
  )
  .get(
    "/songs",
    async ({ query }) => {
      const { q, page = "1", limit = "20" } = query;
      if (!q) return { success: false, error: "Query required" };
      const data = await jiosaavn.searchSongs(q, parseInt(page), parseInt(limit));
      return { success: true, data };
    },
    { detail: { summary: "Search songs" } }
  )
  .get(
    "/albums",
    async ({ query }) => {
      const { q, page = "1", limit = "20" } = query;
      if (!q) return { success: false, error: "Query required" };
      const data = await jiosaavn.searchAlbums(q, parseInt(page), parseInt(limit));
      return { success: true, data };
    },
    { detail: { summary: "Search albums" } }
  )
  .get(
    "/artists",
    async ({ query }) => {
      const { q, page = "1", limit = "20" } = query;
      if (!q) return { success: false, error: "Query required" };
      const data = await jiosaavn.searchArtists(q, parseInt(page), parseInt(limit));
      return { success: true, data };
    },
    { detail: { summary: "Search artists" } }
  )
  .get(
    "/playlists",
    async ({ query }) => {
      const { q, page = "1", limit = "20" } = query;
      if (!q) return { success: false, error: "Query required" };
      const data = await jiosaavn.searchPlaylists(q, parseInt(page), parseInt(limit));
      return { success: true, data };
    },
    { detail: { summary: "Search playlists" } }
  );

export default searchRoutes;
