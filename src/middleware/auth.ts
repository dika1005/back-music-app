import { Elysia } from "elysia";
import { auth } from "../lib/auth";

export const authMiddleware = new Elysia({ name: "auth" }).mount(auth.handler).macro({
  isAuth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({ headers });
      if (!session) return status(401);
      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});

export default authMiddleware;
