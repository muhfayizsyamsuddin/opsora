import { Request, Response } from "express";

import { success } from "../../utils/response.js";
import { UserService } from "./user.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class UserController {
  static me = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getProfile(req.user!.id);

    return success(res, user);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search?.toString();
    const roleId = req.query.roleId?.toString();

    const sort = (req.query.sort?.toString() ?? "createdAt") as
      | "name"
      | "email"
      | "createdAt";

    const order = (req.query.order?.toString() ?? "desc") as
      | "asc"
      | "desc";

    const users = await UserService.getAllUsers(
      page,
      limit,
      search,
      roleId,
      sort,
      order,
    );

    return success(res, users);
  });

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
}