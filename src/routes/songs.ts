import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const songsRoutes = new Elysia({ prefix: "/songs", tags: ["Songs"] })
  .get(
    "/:id",
    async ({ params }) => {
      const data = await jiosaavn.getSong(params.id);
      if (!data) return { success: false, error: "Song not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get song details with stream URL" } }
  )
  .get(
    "/:id/lyrics",
    async ({ params }) => {
      const data = await jiosaavn.getSongLyrics(params.id);
      if (!data) return { success: false, error: "Lyrics not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get song lyrics" } }
  )
  .get(
    "/:id/suggestions",
    async ({ params, query }) => {
      const limit = parseInt(query.limit || "10");
      const data = await jiosaavn.getSongSuggestions(params.id, limit);
      return { success: true, data };
    },
    { detail: { summary: "Get song suggestions" } }
  );

export default songsRoutes;
