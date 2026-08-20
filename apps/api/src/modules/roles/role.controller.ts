import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { RoleService } from "./role.service.js";

export class RoleController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const role = await RoleService.create(req.body);

      return success(
        res,
        role,
        "Role created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search?.toString();

      const roles = await RoleService.getAll(
        page,
        limit,
        search,
      );

      return success(res, roles);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const role = await RoleService.getById(
        String(req.params.id),
      );

      return success(res, role);
    },
  );

  static update = asyncHandler(
    async (req: Request, res: Response) => {
      const role = await RoleService.update(
        String(req.params.id),
        req.body,
      );

      return success(
        res,
        role,
        "Role updated successfully",
      );
    },
  );

  static delete = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await RoleService.delete(
        String(req.params.id),
      );

      return success(res, result);
    },
  );

  static updatePermissions = asyncHandler(
    async (req: Request, res: Response) => {
      const role = await RoleService.update(
        String(req.params.id),
        {
          permissions: req.body.permissions,
        },
      );

      return success(
        res,
        role,
        "Role permissions updated successfully",
      );
    },
  );
}