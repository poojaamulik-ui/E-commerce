import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";

describe("Authentication Utilities", () => {
  it("hashes password and verifies correctly with bcrypt", async () => {
    const plain = "BharatSecurePass@2026";
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    expect(await verifyPassword(plain, hashed)).toBe(true);
    expect(await verifyPassword("WrongPassword", hashed)).toBe(false);
  });

  it("signs and verifies JWT session tokens with role data", async () => {
    const userPayload = {
      userId: "usr_test_12345",
      email: "test.user@bharatbazaar.in",
      name: "Radhika Sen",
      role: "CUSTOMER" as const,
    };

    const token = await createSessionToken(userPayload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(userPayload.userId);
    expect(verified?.email).toBe(userPayload.email);
    expect(verified?.name).toBe(userPayload.name);
    expect(verified?.role).toBe(userPayload.role);
  });

  it("rejects forged or corrupted tokens", async () => {
    const verified = await verifySessionToken("corrupted.jwt.token");
    expect(verified).toBeNull();
  });
});
