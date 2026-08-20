import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);

    return success(res, user, "Register successful");
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.login(req.body);

    return success(res, user, "Login successful");
  });

  static me = asyncHandler(
    async (req: Request, res: Response) => {
      const user = await AuthService.me(req.user!.id);

      return success(
        res,
        user,
        "Current user retrieved successfully",
      );
    },
  );

  static refresh = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await AuthService.refresh(
          req.body.refreshToken,
        );

      return success(
        res,
        result,
        "Token refreshed successfully",
      );
    },
  );

  static logout = asyncHandler(
    async (req: Request, res: Response) => {
      await AuthService.logout(
        req.body.refreshToken,
      );

      return success(
        res,
        null,
        "Logout successful",
      );
    },
  );
}