import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import albumsRoutes from "../src/routes/albums";

const app = new Elysia().group("/api", (app) => app.use(albumsRoutes));

describe("Albums Routes", () => {
  const validAlbumId = "1139549"; // Aashiqui 2

  describe("GET /api/albums/:id", () => {
    it("should return album details for valid ID", async () => {
      const response = await app.handle(new Request(`http://localhost/api/albums/${validAlbumId}`));
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("should return error for invalid ID", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/albums/invalid-album-id")
      );
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });
});
