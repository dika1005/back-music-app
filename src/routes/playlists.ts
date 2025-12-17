import { Elysia, t } from "elysia";
import prisma from "../lib/prisma";
import jiosaavn from "../lib/jiosaavn";
import authMiddleware from "../middleware/auth";

export const playlistsRoutes = new Elysia({ prefix: "/playlists", tags: ["Playlists"] })
  .use(authMiddleware)
  // Get JioSaavn playlist
  .get(
    "/jio/:id",
    async ({ params, query }) => {
      const page = parseInt(query.page || "1");
      const limit = parseInt(query.limit || "50");
      const data = await jiosaavn.getPlaylist(params.id, page, limit);
      if (!data) return { success: false, error: "Playlist not found" };
      return { success: true, data };
    },
    { detail: { summary: "Get JioSaavn playlist" } }
  )
  // User playlists (protected)
  .get(
    "/",
    async ({ user }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const playlists = await prisma.playlist.findMany({
        where: { userId: user.id },
        include: { songs: true },
        orderBy: { updatedAt: "desc" },
      });
      return { success: true, data: playlists };
    },
    { isAuth: true, detail: { summary: "Get user playlists" } }
  )
  .post(
    "/",
    async ({ user, body }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const { name, description, coverImage, isPublic } = body;
      const playlist = await prisma.playlist.create({
        data: {
          userId: user.id,
          name,
          description,
          coverImage,
          isPublic: isPublic ?? false,
        },
      });
      return { success: true, data: playlist };
    },
    {
      isAuth: true,
      body: t.Object({
        name: t.String(),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        isPublic: t.Optional(t.Boolean()),
      }),
      detail: { summary: "Create playlist" },
    }
  )
  .get(
    "/:id",
    async (ctx) => {
      const { params } = ctx;
      const user = (ctx as any).user;
      const playlist = await prisma.playlist.findUnique({
        where: { id: params.id },
        include: { songs: { orderBy: { position: "asc" } } },
      });
      if (!playlist) return { success: false, error: "Playlist not found" };
      if (!playlist.isPublic && playlist.userId !== user?.id) {
        return { success: false, error: "Unauthorized" };
      }
      return { success: true, data: playlist };
    },
    { detail: { summary: "Get playlist by ID (public or own)" } }
  )
  .put(
    "/:id",
    async ({ user, params, body }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
      if (!playlist || playlist.userId !== user.id) {
        return { success: false, error: "Unauthorized" };
      }
      const { name, description, coverImage, isPublic } = body;
      const updated = await prisma.playlist.update({
        where: { id: params.id },
        data: { name, description, coverImage, isPublic },
      });
      return { success: true, data: updated };
    },
    {
      isAuth: true,
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        isPublic: t.Optional(t.Boolean()),
      }),
      detail: { summary: "Update playlist" },
    }
  )
  .delete(
    "/:id",
    async ({ user, params }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
      if (!playlist || playlist.userId !== user.id) {
        return { success: false, error: "Unauthorized" };
      }
      await prisma.playlist.delete({ where: { id: params.id } });
      return { success: true, message: "Playlist deleted" };
    },
    { isAuth: true, detail: { summary: "Delete playlist" } }
  )
  // Add song to playlist
  .post(
    "/:id/songs",
    async ({ user, params, body }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
      if (!playlist || playlist.userId !== user.id) {
        return { success: false, error: "Unauthorized" };
      }
      const lastSong = await prisma.playlistSong.findFirst({
        where: { playlistId: params.id },
        orderBy: { position: "desc" },
      });
      const { songId, songData } = body;
      const song = await prisma.playlistSong.create({
        data: {
          playlistId: params.id,
          songId,
          songData,
          position: (lastSong?.position ?? 0) + 1,
        },
      });
      return { success: true, data: song };
    },
    {
      isAuth: true,
      body: t.Object({
        songId: t.String(),
        songData: t.Any(),
      }),
      detail: { summary: "Add song to playlist" },
    }
  )
  .delete(
    "/:id/songs/:songId",
    async ({ user, params }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
      if (!playlist || playlist.userId !== user.id) {
        return { success: false, error: "Unauthorized" };
      }
      await prisma.playlistSong.deleteMany({
        where: { playlistId: params.id, songId: params.songId },
      });
      return { success: true, message: "Song removed from playlist" };
    },
    { isAuth: true, detail: { summary: "Remove song from playlist" } }
  );

export default playlistsRoutes;
