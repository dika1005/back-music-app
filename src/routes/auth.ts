import { Elysia, t } from "elysia";
import { register, login, getSession, logout, extractToken } from "../lib/auth";

export const authRoutes = new Elysia({ prefix: "/auth", tags: ["Auth"] })
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const result = await register(body);
        set.status = 201;
        return { success: true, data: result };
      } catch (error) {
        set.status = 400;
        return { success: false, error: (error as Error).message };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        name: t.String({ minLength: 1 }),
      }),
      detail: { summary: "Register new user" },
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const result = await login(body.email, body.password);
        return { success: true, data: result };
      } catch (error) {
        set.status = 401;
        return { success: false, error: (error as Error).message };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
      detail: { summary: "Login user" },
    }
  )
  .get(
    "/me",
    async ({ request, set }) => {
      const token = extractToken(request.headers);
      if (!token) {
        set.status = 401;
        return { success: false, error: "No token provided" };
      }
      const session = await getSession(token);
      if (!session) {
        set.status = 401;
        return { success: false, error: "Invalid or expired token" };
      }
      return { success: true, data: session };
    },
    { detail: { summary: "Get current user" } }
  )
  .post(
    "/logout",
    async ({ request, set }) => {
      const token = extractToken(request.headers);
      if (!token) {
        set.status = 401;
        return { success: false, error: "No token provided" };
      }
      await logout(token);
      return { success: true, message: "Logged out successfully" };
    },
    { detail: { summary: "Logout user" } }
  );

export default authRoutes;
