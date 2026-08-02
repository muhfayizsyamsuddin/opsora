import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { DepartmentService } from "./department.service.js";

export class DepartmentController {
    static create = asyncHandler(async (req: Request, res: Response) => {
        const department = await DepartmentService.create(req.body);

        return created(
        res,
        department,
        "Department created successfully",
        );
    });

    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search?.toString();

        const sort = (req.query.sort?.toString() ?? "createdAt") as
        | "name"
        | "createdAt";

        const order = (req.query.order?.toString() ?? "desc") as
        | "asc"
        | "desc";

        const departments = await DepartmentService.getAllDepartments(
        page,
        limit,
        search,
        sort,
        order,
        );

        return success(res, departments);
    });

    static getById = asyncHandler(async (req: Request, res: Response) => {
        const department = await DepartmentService.getById(
            req.params.id.toString(),
        );

        return success(res, department);
    });

    static update = asyncHandler(async (req: Request, res: Response) => {
        const department = await DepartmentService.update(
            req.params.id.toString(),
            req.body,
        );

        return success(
            res,
            department,
            "Department updated successfully",
        );
    });

    static delete = asyncHandler(async (req: Request, res: Response) => {
        await DepartmentService.delete(req.params.id.toString());

        return noContent(res);
    });
}