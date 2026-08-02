import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { EmployeeService } from "./employee.service.js";


export class EmployeeController {
    static create = asyncHandler(async (req: Request, res: Response) => {
        const employee = await EmployeeService.create(req.body);

        return created(
            res,
            employee,
            "Employee created successfully",
        );
    });

    static getAll = asyncHandler(async (_req: Request, res: Response) => {
        const employees = await EmployeeService.getAll();

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