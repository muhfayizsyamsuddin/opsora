import bcrypt from "bcrypt";

import { AppError } from "../../errors/AppError.js";
import { UserRepository } from "../users/user.repository.js";

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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async login(data: {
    email: string;
    password: string;
  }) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }
}