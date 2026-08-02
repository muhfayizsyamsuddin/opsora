import { Request, Response } from "express";

import { success } from "../../utils/response.js";
import { UserService } from "./user.service.js";

export class UserController {
  static async create(req: Request, res: Response) {
    const user = await UserService.create(req.body);

    return success(res, user, "User created successfully");
  }
}