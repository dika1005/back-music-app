import { Elysia } from "elysia";
import jiosaavn from "../lib/jiosaavn";

export const artistsRoutes = new Elysia({ prefix: "/artists", tags: ["Artists"] })
  // Get artist by ID or link with optional sorting
  .get(
    "/",
    async ({ query }) => {
      const { id, link, page = "0", songCount = "10", albumCount = "10", sortBy = "popularity", sortOrder = "desc" } = query;
      if (!id && !link) return { success: false, error: "Either 'id' or 'link' is required" };
      
      const options = {
        page: parseInt(page),
        songCount: parseInt(songCount),
        albumCount: parseInt(albumCount),
        sortBy,
        sortOrder,
      };
      
      const data = await jiosaavn.getArtist(id || "", options);
      if (!data) return { success: false, error: "Artist not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get artist by ID or link with songs and albums" } }
  )
  .get(
    "/:id",
    async ({ params, query }) => {
      const { page = "0", songCount = "10", albumCount = "10", sortBy = "popularity", sortOrder = "desc" } = query;
      
      const data = await jiosaavn.getArtistById(params.id, {
        page: parseInt(page),
        songCount: parseInt(songCount),
        albumCount: parseInt(albumCount),
        sortBy,
        sortOrder,
      });
      
      if (!data) return { success: false, error: "Artist not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get artist details by ID" } }
  )
  .get(
    "/:id/songs",
    async ({ params, query }) => {
      const page = parseInt(query.page || "0");
      const sortBy = query.sortBy || "popularity";
      const sortOrder = query.sortOrder || "desc";
      const data = await jiosaavn.getArtistSongs(params.id, page, sortBy, sortOrder);
      return { success: true, data };
    },
    { detail: { summary: "Get artist songs with pagination and sorting" } }
  )
  .get(
    "/:id/albums",
    async ({ params, query }) => {
      const page = parseInt(query.page || "0");
      const sortBy = query.sortBy || "popularity";
      const sortOrder = query.sortOrder || "desc";
      const data = await jiosaavn.getArtistAlbums(params.id, page, sortBy, sortOrder);
      return { success: true, data };
    },
    { detail: { summary: "Get artist albums with pagination and sorting" } }
  );

export default artistsRoutes;
