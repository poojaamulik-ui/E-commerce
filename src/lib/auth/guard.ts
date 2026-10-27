import { getSession, type SessionUser } from "./session";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Authentication required. Please log in to continue.", 401);
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "ADMIN") {
    throw new AuthError("Access denied. Administrator privileges required.", 403);
  }
  return session;
}

export async function requireStaffOrAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "ADMIN" && session.role !== "STAFF") {
    throw new AuthError("Access denied. Staff privileges required.", 403);
  }
  return session;
}
