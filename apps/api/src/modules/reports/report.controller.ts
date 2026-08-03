import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { ReportService } from "./report.service.js";

export class ReportController {
    static getDashboardReport = asyncHandler(
        async (_req: Request, res: Response) => {
        const report = await ReportService.getDashboardReport();

        return success(res, report);
        },
    );

    static getAttendanceReport = asyncHandler(
        async (_req: Request, res: Response) => {
            const report = await ReportService.getAttendanceReport();

            return success(res, report);
        },
    );

    static getLeaveReport = asyncHandler(
        async (_req: Request, res: Response) => {
            const report = await ReportService.getLeaveReport();

            return success(res, report);
        },
    );

    static getPayrollReport = asyncHandler(
        async (_req: Request, res: Response) => {
            const report = await ReportService.getPayrollReport();

            return success(res, report);
        },
    );

    static getPerformanceReport = asyncHandler(
        async (_req: Request, res: Response) => {
            const report = await ReportService.getPerformanceReport();

            return success(res, report);
        },
    );
}