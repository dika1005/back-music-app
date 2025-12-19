import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import albumsRoutes from "../src/routes/albums";

const app = new Elysia().group("/api", (app) => app.use(albumsRoutes));

describe("Albums Routes", () => {
  const validAlbumId = "1139549"; // Aashiqui 2

  describe("GET /api/albums?id=", () => {
    it("should return album details for valid ID", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/albums?id=${validAlbumId}`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("should handle invalid ID gracefully", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/albums?id=invalid-album-id")
      );
      const data = await response.json();
      // External API may return empty data or success: false for invalid IDs
      expect(data).toHaveProperty("success");
    });

    it("should return error when no id or link provided", async () => {
      const response = await app.handle(new Request("http://localhost/api/albums"));
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });
});
