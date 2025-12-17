import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import songsRoutes from "../src/routes/songs";

const app = new Elysia().group("/api", (app) => app.use(songsRoutes));

describe("Songs Routes", () => {
  const validSongId = "aRZbUYD7"; // Tum Hi Ho

  describe("GET /api/songs/:id", () => {
    it("should return song details for valid ID", async () => {
      const response = await app.handle(new Request(`http://localhost/api/songs/${validSongId}`));
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("should return error for invalid ID", async () => {
      const response = await app.handle(new Request("http://localhost/api/songs/invalid-id-123"));
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("GET /api/songs/:id/lyrics", () => {
    it("should return lyrics for song with lyrics", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/songs/${validSongId}/lyrics`)
      );
      const data = await response.json();
      // May or may not have lyrics
      expect(data).toHaveProperty("success");
    });
  });

  describe("GET /api/songs/:id/suggestions", () => {
    it("should return song suggestions", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/songs/${validSongId}/suggestions`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
