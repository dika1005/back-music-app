import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import authMiddleware from "./middleware/auth";
import { auth } from "./lib/auth";
import { verifyGoogleToken } from "./lib/auth";

// Routes
import searchRoutes from "./routes/search";
import songsRoutes from "./routes/songs";
import albumsRoutes from "./routes/albums";
import artistsRoutes from "./routes/artists";
import playlistsRoutes from "./routes/playlists";
import favoritesRoutes from "./routes/favorites";
import historyRoutes from "./routes/history";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Music App API",
          description: "Backend API untuk aplikasi musik Android dengan JioSaavn integration",
          version: "1.0.0",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints (Better Auth)" },
          { name: "Search", description: "Search songs, albums, artists, and playlists" },
          { name: "Songs", description: "Song details, lyrics, and suggestions" },
          { name: "Albums", description: "Album details and tracks" },
          { name: "Artists", description: "Artist details, songs, and albums" },
          { name: "Playlists", description: "User playlists CRUD operations" },
          { name: "Favorites", description: "User favorites management" },
          { name: "History", description: "Play history tracking" },
        ],
      },
    })
  )
  .use(authMiddleware)
  .group("/api", (app) =>
    app
      // Helper endpoint for browser-based Google OAuth
      .get("/login/google", async ({ redirect, query }) => {
        const callbackURL = query.callbackURL || "http://localhost:3000";
        const response = await auth.api.signInSocial({
          body: {
            provider: "google",
            callbackURL,
          },
        });
        if (response.url) {
          return redirect(response.url);
        }
        return { error: "Failed to initiate Google OAuth" };
      })
      // Health check
      .get("/health", () => ({ status: "ok" }), {
        detail: { tags: ["Health"], summary: "Health check endpoint" },
      })
      // Google token verification for Android
      .post(
        "/auth/google/verify",
        async ({ body }) => {
          const { idToken } = body as { idToken: string };
          if (!idToken) {
            return { error: "idToken is required" };
          }
          try {
            const payload = await verifyGoogleToken(idToken);
            // Here you can create or update user in DB using payload.sub, payload.email, etc.
            return {
              success: true,
              user: { sub: payload.sub, email: payload.email, name: payload.name },
            };
          } catch (error) {
            console.error("Token verification error:", error);
            return { error: "Invalid token" };
          }
        },
        {
          detail: { tags: ["Auth"], summary: "Verify Google OAuth token from Android app" },
        }
      )
      // Feature routes
      .use(searchRoutes)
      .use(songsRoutes)
      .use(albumsRoutes)
      .use(artistsRoutes)
      .use(playlistsRoutes)
      .use(favoritesRoutes)
      .use(historyRoutes)
  )
  .listen(process.env.PORT || 3000);

console.log(`🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger docs at http://${app.server?.hostname}:${app.server?.port}/swagger`);
