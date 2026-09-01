import bcrypt from "bcrypt";

import { AppError } from "../../errors/AppError.js";
import { UserRepository } from "../users/user.repository.js";
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiresAt, verifyRefreshToken } from "../../utils/jwt.js";
import { prisma } from "../../lib/prisma.js";

export class AuthService {
  // static async register(data: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }) {
  //   const existingUser = await UserRepository.findByEmail(data.email);

  //   if (existingUser) {
  //     throw new AppError("Email already exists", 409);
  //   }

  //   const staffRole = await UserRepository.findRoleByName("STAFF");

  //   if (!staffRole) {
  //     throw new AppError(
  //       "Default STAFF role is not configured",
  //       500,
  //     );
  //   }

  //   const hashedPassword = await bcrypt.hash(data.password, 10);

  //   const user = await UserRepository.create({
  //     name: data.name,
  //     email: data.email,
  //     password: hashedPassword,
  //     roleId: staffRole.id,
  //   });

  //   return {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.roleRef?.name ?? null,
  //     roleId: user.roleId,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //   };
  // }

  static async login(data: {
    email: string;
    password: string;
  }) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
      throw new AppError(
        "Account is inactive",
        401,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiresAt(),
      },
    });

    const permissions =
      user.roleRef?.permissions.map(
        (item) => item.permission.name,
      ) ?? [];

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleRef?.name ?? null,
      roleId: user.roleId,
      permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      access_token: accessToken,
      token_type: "Bearer",
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roleRef?.name
          ? [user.roleRef.name]
          : [],
        permissions,
      },
    };
  }

  static async me(userId: string) {
    const user = await UserRepository.findByIdWithPermissions(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.isActive) {
      throw new AppError("Account is inactive", 401);
    }

    const permissions =
      user.roleRef?.permissions.map(
        (item) => item.permission.name,
      ) ?? [];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roleRef?.name
        ? [user.roleRef.name]
        : [],
      permissions,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const stored = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!stored) {
      throw new AppError(
        "Invalid refresh token",
        401,
      );
    }

    if (stored.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: stored.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      throw new AppError(
        "Refresh token reuse detected",
        401,
      );
    }

    if (stored.expiresAt <= new Date()) {
      throw new AppError(
        "Refresh token expired",
        401,
      );
    }

    if (stored.userId !== payload.id) {
      throw new AppError(
        "Invalid refresh token",
        401,
      );
    }

    const user = await UserRepository.findById(
      payload.id,
    );

    if (!user || !user.isActive) {
      throw new AppError(
        "Account is inactive",
        401,
      );
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const newRefreshToken =
      generateRefreshToken({
        id: user.id,
      });

    const rotationSucceeded =
      await prisma.$transaction(async (tx) => {
        const revoked =
          await tx.refreshToken.updateMany({
            where: {
              id: stored.id,
              revokedAt: null,
            },
            data: {
              revokedAt: new Date(),
            },
          });

        if (revoked.count !== 1) {
          return false;
        }

        await tx.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: user.id,
            expiresAt: getRefreshTokenExpiresAt(),
          },
        });

        return true;
      });

    if (!rotationSucceeded) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: stored.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      throw new AppError(
        "Refresh token reuse detected",
        401,
      );
    }

    return {
      access_token: accessToken,
      token_type: "Bearer",
      refresh_token: newRefreshToken,
    };
  }

  static async logout(refreshToken: string) {
    const stored =
      await prisma.refreshToken.findUnique({
        where: {
          token: refreshToken,
        },
      });

    if (stored && !stored.revokedAt) {
      await prisma.refreshToken.update({
        where: {
          token: refreshToken,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    return null;
  }

  static async updateMe(
    userId: string,
    data: {
      name?: string;
      email?: string;
    },
  ) {
    const user = await UserRepository.findById(
      userId,
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.isActive) {
      throw new AppError(
        "Account is inactive",
        401,
      );
    }

    if (
      data.email &&
      data.email !== user.email
    ) {
      const existingUser =
        await UserRepository.findByEmail(
          data.email,
        );

      if (existingUser) {
        throw new AppError(
          "Email already exists",
          409,
        );
      }
    }

    const updatedUser =
      await UserRepository.update(userId, {
        name: data.name,
        email: data.email,
      });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role:
        updatedUser.roleRef?.name ?? null,
      roleId: updatedUser.roleId,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  static async changePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    },
  ) {
    const user =
      await UserRepository.findById(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404,
      );
    }

    if (!user.isActive) {
      throw new AppError(
        "Account is inactive",
        401,
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        data.currentPassword,
        user.password,
      );

    if (!isPasswordValid) {
      throw new AppError(
        "Current password is incorrect",
        400,
      );
    }

    const isSamePassword =
      await bcrypt.compare(
        data.newPassword,
        user.password,
      );

    if (isSamePassword) {
      throw new AppError(
        "New password must be different from current password",
        400,
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        data.newPassword,
        10,
      );

    await UserRepository.updatePassword(
      userId,
      hashedPassword,
    );

    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}