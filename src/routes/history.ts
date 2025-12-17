import { Elysia, t } from "elysia";
import prisma from "../lib/prisma";
import authMiddleware from "../middleware/auth";

export const historyRoutes = new Elysia({ prefix: "/history", tags: ["History"] })
  .use(authMiddleware)
  .get(
    "/",
    async ({ user, query }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const limit = parseInt(query.limit || "50");
      const history = await prisma.history.findMany({
        where: { userId: user.id },
        orderBy: { playedAt: "desc" },
        take: limit,
      });
      return { success: true, data: history };
    },
    { isAuth: true, detail: { summary: "Get play history" } }
  )
  .post(
    "/",
    async ({ user, body }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      const { songId, songData } = body;
      const entry = await prisma.history.create({
        data: {
          userId: user.id,
          songId,
          songData,
        },
      });
      return { success: true, data: entry };
    },
    {
      isAuth: true,
      body: t.Object({
        songId: t.String(),
        songData: t.Any(),
      }),
      detail: { summary: "Add song to history" },
    }
  )
  .delete(
    "/",
    async ({ user }) => {
      if (!user) return { success: false, error: "Unauthorized" };
      await prisma.history.deleteMany({
        where: { userId: user.id },
      });
      return { success: true, message: "History cleared" };
    },
    { isAuth: true, detail: { summary: "Clear play history" } }
  );

export default historyRoutes;
