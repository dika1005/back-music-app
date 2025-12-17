import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const albumsRoutes = new Elysia({ prefix: "/albums", tags: ["Albums"] }).get(
  "/:id",
  async ({ params }) => {
    const data = (await jiosaavn.getAlbum(params.id)) as Record<string, unknown> | null;
    // Check if data exists and has valid album properties
    if (!data || !data.id || !data.name) return { success: false, error: "Album not found" };
    return { success: true, data };
  },
  { detail: { summary: "Get album details with tracks" } }
);

export default albumsRoutes;
