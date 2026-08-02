import { Request, Response } from "express";

import { success } from "../../utils/response.js";
import { UserService } from "./user.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class UserController {
  static me = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getProfile(req.user!.id);

    return success(res, user);
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();

    return success(res, users);
  });
}