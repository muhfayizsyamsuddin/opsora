import { Request, Response } from "express";

import { success } from "../../utils/response.js";
import { UserService } from "./user.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class UserController {
  static me = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getProfile(req.user!.id);

    return success(res, user);
  });

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(
        req.query.page ?? 1,
      );

      const perPage = Number(
        req.query.per_page ?? 20,
      );

      const search =
        req.query.search?.toString();

      const roleId =
        req.query.role_id?.toString();

      const sortBy =
        (req.query.sort_by?.toString() ??
          "createdAt") as
          | "name"
          | "email"
          | "createdAt";

      const sortOrder =
        (req.query.sort_order?.toString() ??
          "desc") as
          | "asc"
          | "desc";

      const users =
        await UserService.getAllUsers(
          page,
          perPage,
          search,
          roleId,
          sortBy,
          sortOrder,
        );

      return success(res, users);
    },
  );

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);

    const user = await UserService.getById(id);

    return success(res, user);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);

    const user = await UserService.update(id, req.body);

    return success(res, user, "User updated successfully");
  });

  static assignRole = asyncHandler(
    async (req: Request, res: Response) => {
      const user =
        await UserService.assignRole(
          String(req.params.id),
          req.body.roleId,
        );

      return success(
        res,
        user,
        "User role updated successfully",
      );
    },
  );

  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const user = await UserService.create(req.body);

      return success(
        res,
        user,
        "User created successfully",
      );
    },
  );

  static getPermissions = asyncHandler(
    async (req: Request, res: Response) => {
      const permissions =
        await UserService.getEffectivePermissions(
          String(req.params.id),
        );

      return success(
        res,
        permissions,
      );
    },
  );

  static delete = asyncHandler(
    async (req: Request, res: Response) => {
      const user =
        await UserService.delete(
          String(req.params.id),
          req.user!.id,
        );

      return success(
        res,
        user,
        "User deactivated successfully",
      );
    },
  );
}