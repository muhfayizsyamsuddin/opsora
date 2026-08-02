import { NextFunction, Request, Response } from "express";

import { UserRole } from "../generated/prisma/enums.js";
import { AppError } from "../errors/AppError.js";

export function authorize(...roles: UserRole[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}