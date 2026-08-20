import bcrypt from "bcrypt";

import { AppError } from "../../errors/AppError.js";
import { UserRepository } from "../users/user.repository.js";
import { generateAccessToken } from "../../utils/jwt.js";

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await UserRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const staffRole = await UserRepository.findRoleByName("STAFF");

    if (!staffRole) {
      throw new AppError(
        "Default STAFF role is not configured",
        500,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: staffRole.id,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleRef?.name ?? null,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

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
      accessToken,
      user: safeUser,
    };
  }
}