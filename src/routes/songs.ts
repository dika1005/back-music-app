import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const songsRoutes = new Elysia({ prefix: "/songs", tags: ["Songs"] })
  // Get songs by IDs or link
  .get(
    "/",
    async ({ query }) => {
      const { ids, link } = query;
      if (!ids && !link) return { success: false, error: "Either 'ids' or 'link' is required" };
      
      let data;
      if (ids) {
        const idArray = ids.split(",").map((id: string) => id.trim());
        data = await jiosaavn.getSongsByIds(idArray);
      } else if (link) {
        data = await jiosaavn.getSongByLink(link);
      }
      
      if (!data) return { success: false, error: "Song(s) not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get songs by IDs or link" } }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await jiosaavn.getSong(params.id);
      if (!data) return { success: false, error: "Song not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get song details by ID" } }
  )
  .get(
    "/:id/suggestions",
    async ({ params, query }) => {
      const limit = parseInt(query.limit || "10");
      const data = await jiosaavn.getSongSuggestions(params.id, limit);
      return { success: true, data };
    },
    { detail: { summary: "Get song suggestions for infinite playback" } }
  );

export default songsRoutes;
