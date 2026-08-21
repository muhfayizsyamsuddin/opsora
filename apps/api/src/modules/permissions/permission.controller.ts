import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { PermissionService } from "./permission.service.js";

export class PermissionController {
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

      const sortBy =
        (req.query.sort_by?.toString() ??
          "name") as
          | "name"
          | "createdAt";

      const sortOrder =
        (req.query.sort_order?.toString() ??
          "asc") as
          | "asc"
          | "desc";

      const permissions =
        await PermissionService.getAll(
          page,
          perPage,
          search,
          sortBy,
          sortOrder,
        );

      return success(
        res,
        permissions,
      );
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