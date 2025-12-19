import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import authMiddleware from "./middleware/auth";

// Routes
import authRoutes from "./routes/auth";
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
          { name: "Auth", description: "Authentication endpoints (Login/Register)" },
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
      // Health check
      .get("/health", () => ({ status: "ok" }), {
        detail: { tags: ["Health"], summary: "Health check endpoint" },
      })
      // Feature routes
      .use(authRoutes)
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

