import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { EmployeeService } from "./employee.service.js";
import { EmployeeStatus } from "../../generated/prisma/browser.js";


export class EmployeeController {
    static create = asyncHandler(async (req: Request, res: Response) => {
        const employee = await EmployeeService.create(req.body);

        return created(
            res,
            employee,
            "Employee created successfully",
        );
    });

    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const employees = await EmployeeService.getAll({
            page: req.query.page
            ? Number(req.query.page)
            : undefined,
            limit: req.query.limit
            ? Number(req.query.limit)
            : undefined,
            search: req.query.search?.toString(),
            departmentId: req.query.departmentId?.toString(),
            status: req.query.status as EmployeeStatus | undefined,
            sort: req.query.sort as
            | "name"
            | "salary"
            | "hireDate"
            | "createdAt"
            | undefined,
            order: req.query.order as
            | "asc"
            | "desc"
            | undefined,
        });

        return success(res, employees);
    });

    static getById = asyncHandler(async (req: Request, res: Response) => {
        const employee = await EmployeeService.getById(
            req.params.id.toString(),
        );

        return success(res, employee);
    });

    static update = asyncHandler(async (req: Request, res: Response) => {
        const employee = await EmployeeService.update(
            req.params.id.toString(),
            req.body,
        );

        return success(
            res,
            employee,
            "Employee updated successfully",
        );
    });

    static delete = asyncHandler(async (req: Request, res: Response) => {
        await EmployeeService.delete(req.params.id.toString());

        return noContent(res);
    });
}