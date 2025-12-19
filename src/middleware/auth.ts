import { Elysia } from "elysia";
import { getSession, extractToken } from "../lib/auth";

export const authMiddleware = new Elysia({ name: "auth" }).macro({
  isAuth: {
    async resolve({ status, request: { headers } }) {
      const token = extractToken(headers);
      if (!token) return status(401);

      const session = await getSession(token);
      if (!session) return status(401);

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});

export default authMiddleware;
