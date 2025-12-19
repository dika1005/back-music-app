import { describe, it, expect, beforeAll } from "bun:test";

// Skip integration tests if server is not running (e.g., in CI)
const baseUrl = process.env.TEST_SERVER_URL || "http://localhost:3000";
let serverAvailable = false;

beforeAll(async () => {
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(2000),
    });
    serverAvailable = response.ok;
  } catch {
    serverAvailable = false;
    console.log("⚠️ Server not running - skipping integration tests (this is expected in CI)");
  }
});

describe("Health Check", () => {
  it("should return ok status", async () => {
    if (!serverAvailable) {
      console.log("Skipped: server not available");
      return;
    }
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    expect(data.status).toBe("ok");
  });
});

describe("API Endpoints Availability", () => {
  it("should have search endpoint", async () => {
    if (!serverAvailable) {
      console.log("Skipped: server not available");
      return;
    }
    const response = await fetch(`${baseUrl}/api/search/songs?q=test`);
    expect(response.status).toBe(200);
  });

  it("should have songs endpoint", async () => {
    if (!serverAvailable) {
      console.log("Skipped: server not available");
      return;
    }
    const response = await fetch(`${baseUrl}/api/songs/aRZbUYD7`);
    expect(response.status).toBe(200);
  });

  it("should have albums endpoint", async () => {
    if (!serverAvailable) {
      console.log("Skipped: server not available");
      return;
    }
    const response = await fetch(`${baseUrl}/api/albums?id=1139549`);
    expect(response.status).toBe(200);
  });

  it("should have artists endpoint", async () => {
    if (!serverAvailable) {
      console.log("Skipped: server not available");
      return;
    }
    const response = await fetch(`${baseUrl}/api/artists/459320`);
    expect(response.status).toBe(200);
  });
});
