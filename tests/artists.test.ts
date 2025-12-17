import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import artistsRoutes from "../src/routes/artists";

const app = new Elysia().group("/api", (app) => app.use(artistsRoutes));

describe("Artists Routes", () => {
  const validArtistId = "459320"; // Arijit Singh

  describe("GET /api/artists/:id", () => {
    it("should return artist details for valid ID", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/artists/${validArtistId}`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("should return error for invalid ID", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/artists/invalid-artist-id")
      );
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("GET /api/artists/:id/songs", () => {
    it("should return artist songs", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/artists/${validArtistId}/songs`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe("GET /api/artists/:id/albums", () => {
    it("should return artist albums", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/artists/${validArtistId}/albums`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
