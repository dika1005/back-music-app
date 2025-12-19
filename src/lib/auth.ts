import prisma from "./prisma";

// Hash password using Bun's built-in hasher
export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

// Generate random token
export function generateToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
}

// Register new user
export async function register(data: { email: string; password: string; name: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  // Create session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    token,
  };
}

// Login user
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // Create session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    token,
  };
}

// Get session by token
export async function getSession(token: string) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
    session: { id: session.id, expiresAt: session.expiresAt },
  };
}

// Logout - delete session
export async function logout(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}

// Extract token from Authorization header
export function extractToken(headers: Headers): string | null {
  const authHeader = headers.get("Authorization");
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return authHeader;
}
