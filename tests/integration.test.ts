import { describe, it, expect } from "bun:test";

describe("Health Check", () => {
  const baseUrl = "http://localhost:3000";

  it("should return ok status", async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    expect(data.status).toBe("ok");
  });
});

describe("API Endpoints Availability", () => {
  const baseUrl = "http://localhost:3000";

  it("should have search endpoint", async () => {
    const response = await fetch(`${baseUrl}/api/search/songs?q=test`);
    expect(response.status).toBe(200);
  });

  it("should have songs endpoint", async () => {
    const response = await fetch(`${baseUrl}/api/songs/aRZbUYD7`);
    expect(response.status).toBe(200);
  });

  it("should have albums endpoint", async () => {
    const response = await fetch(`${baseUrl}/api/albums/1139549`);
    expect(response.status).toBe(200);
  });

  it("should have artists endpoint", async () => {
    const response = await fetch(`${baseUrl}/api/artists/459320`);
    expect(response.status).toBe(200);
  });
});
