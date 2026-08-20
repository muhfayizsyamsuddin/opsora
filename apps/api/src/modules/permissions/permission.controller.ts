import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { PermissionService } from "./permission.service.js";

export class PermissionController {
  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search?.toString();

      const permissions =
        await PermissionService.getAll(
          page,
          limit,
          search,
        );

      return success(res, permissions);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const permission =
        await PermissionService.getById(
          String(req.params.id),
        );

      return success(res, permission);
    },
  );
}