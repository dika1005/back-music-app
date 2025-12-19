import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import songsRoutes from "../src/routes/songs";

const app = new Elysia().group("/api", (app) => app.use(songsRoutes));

describe("Songs Routes", () => {
  const validSongId = "aRZbUYD7"; // Tum Hi Ho

  describe("GET /api/songs?ids=", () => {
    it("should return songs for valid IDs", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/songs?ids=${validSongId}`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("should return error when no ids or link provided", async () => {
      const response = await app.handle(new Request("http://localhost/api/songs"));
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

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

  describe("GET /api/songs/:id/suggestions", () => {
    it("should return song suggestions", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/songs/${validSongId}/suggestions`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should accept limit parameter", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/songs/${validSongId}/suggestions?limit=5`)
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
