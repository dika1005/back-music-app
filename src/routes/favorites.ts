import { Elysia, t } from "elysia";
import prisma from "../lib/prisma";
import authMiddleware from "../middleware/auth";

export const favoritesRoutes = new Elysia({ prefix: "/favorites", tags: ["Favorites"] })
  .use(authMiddleware)
  .get(
    "/",
    async ({ user }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, data: favorites };
    },
    { isAuth: true, detail: { summary: "Get user favorites" } }
  )
  .post(
    "/",
    async ({ user, body }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const { songId, songData } = body;
      const favorite = await prisma.favorite.upsert({
        where: {
          userId_songId: { userId: user.id, songId },
        },
        update: { songData },
        create: {
          userId: user.id,
          songId,
          songData,
        },
      });
      return { success: true, data: favorite };
    },
    {
      isAuth: true,
      body: t.Object({
        songId: t.String(),
        songData: t.Any(),
      }),
      detail: { summary: "Add song to favorites" },
    }
  )
  .get(
    "/:songId/check",
    async ({ user, params }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_songId: { userId: user.id, songId: params.songId },
        },
      });
      return { success: true, data: { isFavorite: !!favorite } };
    },
    { isAuth: true, detail: { summary: "Check if song is favorited" } }
  )
  .delete(
    "/:songId",
    async ({ user, params }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      await prisma.favorite.deleteMany({
        where: { userId: user.id, songId: params.songId },
      });
      return { success: true, message: "Removed from favorites" };
    },
    { isAuth: true, detail: { summary: "Remove song from favorites" } }
  );

export default favoritesRoutes;
