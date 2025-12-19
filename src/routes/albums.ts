import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const albumsRoutes = new Elysia({ prefix: "/albums", tags: ["Albums"] })
  .get(
    "/",
    async ({ query }) => {
      const { id, link } = query;
      if (!id && !link) return { success: false, error: "Either 'id' or 'link' is required" };
      
      let data;
      if (id) {
        data = await jiosaavn.getAlbum(id);
      } else if (link) {
        data = await jiosaavn.getAlbumByLink(link);
      }
      
      if (!data) return { success: false, error: "Album not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get album by ID or link" } }
  );

export default albumsRoutes;
