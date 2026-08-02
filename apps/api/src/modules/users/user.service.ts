import bcrypt from "bcrypt";

import { UserRole } from "../../generated/prisma/enums.js";
import { AppError } from "../../errors/AppError.js";
import { UserRepository } from "./user.repository.js";

export class UserService {
  static async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
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
}