import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import authMiddleware from "../src/middleware/auth";
import { auth } from "../src/lib/auth";

// Routes
import searchRoutes from "../src/routes/search";
import songsRoutes from "../src/routes/songs";
import albumsRoutes from "../src/routes/albums";
import artistsRoutes from "../src/routes/artists";
import playlistsRoutes from "../src/routes/playlists";
import favoritesRoutes from "../src/routes/favorites";
import historyRoutes from "../src/routes/history";

const app = new Elysia({ adapter: node() })
  .use(cors())
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Music App API",
          description:
            "Backend API untuk aplikasi musik Android dengan JioSaavn integration",
          version: "1.0.0",
        },
        tags: [
          {
            name: "Auth",
            description: "Authentication endpoints (Better Auth)",
          },
          {
            name: "Search",
            description: "Search songs, albums, artists, and playlists",
          },
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
      // Feature routes
      .use(searchRoutes)
      .use(songsRoutes)
      .use(albumsRoutes)
      .use(artistsRoutes)
      .use(playlistsRoutes)
      .use(favoritesRoutes)
      .use(historyRoutes)
  );

export default app;
