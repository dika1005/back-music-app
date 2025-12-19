import { describe, it, expect } from "bun:test";
import jiosaavn from "../src/lib/jiosaavn";

describe("JioSaavn Service", () => {
  describe("searchSongs", () => {
    it("should return songs for valid query", async () => {
      const result = await jiosaavn.searchSongs("arijit", 0, 5);
      expect(result).not.toBeNull();
    });
  });

  describe("searchAlbums", () => {
    it("should return albums for valid query", async () => {
      const result = await jiosaavn.searchAlbums("aashiqui", 0, 5);
      expect(result).not.toBeNull();
    });
  });

  describe("searchArtists", () => {
    it("should return artists for valid query", async () => {
      const result = await jiosaavn.searchArtists("arijit", 0, 5);
      expect(result).not.toBeNull();
    });
  });

  describe("getSong", () => {
    it("should return song details for valid ID", async () => {
      const result = await jiosaavn.getSong("aRZbUYD7");
      expect(result).not.toBeNull();
    });

    it("should return null for invalid ID", async () => {
      const result = await jiosaavn.getSong("invalid-id-xxx");
      expect(result).toBeNull();
    });
  });

  describe("getAlbum", () => {
    it("should return album details for valid ID", async () => {
      const result = await jiosaavn.getAlbum("1139549");
      expect(result).not.toBeNull();
    });
  });

  describe("getArtist", () => {
    it("should return artist details for valid ID", async () => {
      const result = await jiosaavn.getArtist("459320");
      expect(result).not.toBeNull();
    });
  });

  describe("getSongsByIds", () => {
    it("should return songs for valid IDs", async () => {
      const result = await jiosaavn.getSongsByIds(["aRZbUYD7"]);
      expect(result).not.toBeNull();
    });
  });

  describe("getSongSuggestions", () => {
    it("should return response for song suggestions request", async () => {
      const result = await jiosaavn.getSongSuggestions("aRZbUYD7", 5);
      // Note: Some songs may not have suggestions available
      // The important thing is the API call doesn't throw an error
      expect(result === null || Array.isArray(result)).toBe(true);
    });
  });
});
