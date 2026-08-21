import { beforeAll, afterAll, describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import { prisma } from "../../../src/lib/prisma.js";
import { AuthService } from "../../../src/modules/auth/auth.service.js";

describe("Auth refresh token lifecycle", () => {
  let userId: string;
  let roleId: string;
  let refreshTokenA: string;
  let refreshTokenB: string;

  const email = `auth-test-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  beforeAll(async () => {
    const role = await prisma.role.create({
      data: {
        name: `TEST_ROLE_${Date.now()}`,
      },
    });

    roleId = role.id;

    const user = await prisma.user.create({
      data: {
        name: "Auth Test User",
        email,
        password: await bcrypt.hash(password, 10),
        roleId,
        isActive: true,
      },
    });

    userId = user.id;
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    await prisma.role.delete({
      where: {
        id: roleId,
      },
    });

    await prisma.$disconnect();
  });

  it("rotates refresh tokens and revokes the old token", async () => {
    const loginResult = await AuthService.login({
      email,
      password,
    });

    refreshTokenA = loginResult.refresh_token;

    const firstRefresh =
      await AuthService.refresh(refreshTokenA);

    expect(firstRefresh.refresh_token).toBeTruthy();
    expect(firstRefresh.refresh_token).not.toBe(
      refreshTokenA,
    );

    refreshTokenB = firstRefresh.refresh_token;

    const oldToken =
      await prisma.refreshToken.findUnique({
        where: {
          token: refreshTokenA,
        },
      });

    const newToken =
      await prisma.refreshToken.findUnique({
        where: {
          token: refreshTokenB,
        },
      });

    expect(oldToken?.revokedAt).not.toBeNull();
    expect(newToken?.revokedAt).toBeNull();
  });

  it("detects refresh token reuse and revokes active refresh tokens", async () => {
    await expect(
      AuthService.refresh(refreshTokenA),
    ).rejects.toThrow(
      "Refresh token reuse detected",
    );

    const activeTokens =
      await prisma.refreshToken.findMany({
        where: {
          userId,
          revokedAt: null,
        },
      });

    expect(activeTokens).toHaveLength(0);
  });

  it("rejects the rotated token after reuse detection revoked the session", async () => {
    await expect(
      AuthService.refresh(refreshTokenB),
    ).rejects.toThrow(
      "Refresh token reuse detected",
    );
  });
});