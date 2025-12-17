import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const artistsRoutes = new Elysia({ prefix: "/artists", tags: ["Artists"] })
  .get(
    "/:id",
    async ({ params }) => {
      const data = (await jiosaavn.getArtist(params.id)) as Record<string, unknown> | null;
      // Check if data exists and has valid artist properties
      if (!data || !data.id || !data.name) return { success: false, error: "Artist not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get artist details" } }
  )
  .get(
    "/:id/songs",
    async ({ params, query }) => {
      const page = parseInt(query.page || "1");
      const data = await jiosaavn.getArtistSongs(params.id, page);
      return { success: true, data };
    },
    { detail: { summary: "Get artist songs" } }
  )
  .get(
    "/:id/albums",
    async ({ params, query }) => {
      const page = parseInt(query.page || "1");
      const data = await jiosaavn.getArtistAlbums(params.id, page);
      return { success: true, data };
    },
    { detail: { summary: "Get artist albums" } }
  );

export default artistsRoutes;
