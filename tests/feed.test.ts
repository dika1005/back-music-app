import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import feedRoutes from "../src/routes/feed";

const app = new Elysia().group("/api", (app) => app.use(feedRoutes));

describe("Feed Routes", () => {
  describe("GET /api/feed", () => {
    it("should return homepage feed with all sections", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed?language=english&limit=3")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.trending).toBeDefined();
      expect(data.data.newReleases).toBeDefined();
      expect(data.data.forYou).toBeDefined();
      expect(data.data.artists).toBeDefined();
      expect(data.data.albums).toBeDefined();
    });
  });

  describe("GET /api/feed/trending", () => {
    it("should return trending songs", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/trending?limit=5")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("Trending Now 🔥");
      expect(data.data.items).toBeDefined();
    });
  });

  describe("GET /api/feed/new-releases", () => {
    it("should return new releases", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/new-releases?limit=5")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("New Releases ✨");
    });
  });

  describe("GET /api/feed/by-language/:language", () => {
    it("should return songs for valid language", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/by-language/hindi?limit=5")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.language).toBe("hindi");
    });

    it("should return error for invalid language", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/by-language/invalid")
      );
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("GET /api/feed/playlists", () => {
    it("should return featured playlists by category", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/playlists")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.categories).toBeDefined();
      expect(Array.isArray(data.data.categories)).toBe(true);
    });
  });

  describe("GET /api/feed/artists", () => {
    it("should return top artists", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/artists?limit=5")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("Top Artists 🎤");
    });
  });

  describe("GET /api/feed/charts", () => {
    it("should return chart songs for english (default)", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/charts?limit=5")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.chart).toBe("english");
    });

    it("should return chart songs for english", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/feed/charts?chart=english&limit=5")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.chart).toBe("english");
    });
  });
});
