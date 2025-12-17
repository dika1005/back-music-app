import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Elysia } from "elysia";
import searchRoutes from "../src/routes/search";

const app = new Elysia().group("/api", (app) => app.use(searchRoutes));

describe("Search Routes", () => {
  describe("GET /api/search", () => {
    it("should return error when query is missing", async () => {
      const response = await app.handle(new Request("http://localhost/api/search"));
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Query required");
    });

    it("should return search results", async () => {
      const response = await app.handle(new Request("http://localhost/api/search?q=arijit"));
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe("GET /api/search/songs", () => {
    it("should return error when query is missing", async () => {
      const response = await app.handle(new Request("http://localhost/api/search/songs"));
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should return song results", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/search/songs?q=tum+hi+ho")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe("GET /api/search/albums", () => {
    it("should return album results", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/search/albums?q=aashiqui")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe("GET /api/search/artists", () => {
    it("should return artist results", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/search/artists?q=arijit")
      );
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
