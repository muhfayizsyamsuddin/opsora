import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export function requirePermission(permissionName: string) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return next(
          new AppError("Unauthorized", 401),
        );
      }

      const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
          isActive: true,
          roleId: true,
          roleRef: {
            select: {
              name: true,
              permissions: {
                select: {
                  permission: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive) {
        return next(
          new AppError("Account is inactive", 401),
        );
      }

      if (!user?.roleId || !user.roleRef) {
        return next(
          new AppError("Forbidden", 403),
        );
      }

      const hasPermission =
        user.roleRef.permissions.some(
          (item) =>
            item.permission.name === permissionName,
        );

      if (!hasPermission) {
        return next(
          new AppError("Forbidden", 403),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}