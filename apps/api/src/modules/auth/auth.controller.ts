import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);

    return success(res, user, "User registered successfully");
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.login(req.body);

    return success(res, user, "Login successful");
  });
}