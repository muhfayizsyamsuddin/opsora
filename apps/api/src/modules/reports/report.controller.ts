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

    static getSalesReport = asyncHandler(
        async (req: Request, res: Response) => {
            const report =
            await ReportService.getSalesReport(
                req.query.date_from
                ? new Date(
                    req.query.date_from.toString(),
                    )
                : undefined,
                req.query.date_to
                ? new Date(
                    req.query.date_to.toString(),
                    )
                : undefined,
            );

            return success(res, report);
        },
        );

    static getPurchasesReport = asyncHandler(
        async (req: Request, res: Response) => {
            const report =
            await ReportService.getPurchasesReport(
                req.query.date_from
                ? new Date(
                    req.query.date_from.toString(),
                    )
                : undefined,
                req.query.date_to
                ? new Date(
                    req.query.date_to.toString(),
                    )
                : undefined,
            );

            return success(res, report);
        },
        );

    static getInventoryReport = asyncHandler(
        async (req: Request, res: Response) => {
            const report =
            await ReportService.getInventoryReport(
                req.query.date_from
                ? new Date(
                    req.query.date_from.toString(),
                    )
                : undefined,
                req.query.date_to
                ? new Date(
                    req.query.date_to.toString(),
                    )
                : undefined,
            );

            return success(res, report);
        },
        );

    static getProfitReport = asyncHandler(
        async (req: Request, res: Response) => {
            const report =
            await ReportService.getProfitReport(
                req.query.date_from
                ? new Date(
                    req.query.date_from.toString(),
                    )
                : undefined,
                req.query.date_to
                ? new Date(
                    req.query.date_to.toString(),
                    )
                : undefined,
            );

            return success(res, report);
        },
    );

    static exportSalesReport = asyncHandler(
        async (req: Request, res: Response) => {
            const csv =
            await ReportService.exportSalesReport(
                req.query.date_from
                ? new Date(req.query.date_from.toString())
                : undefined,
                req.query.date_to
                ? new Date(req.query.date_to.toString())
                : undefined,
            );

            const fileName =
            `sales-report-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;

            res.setHeader(
            "Content-Type",
            "text/csv; charset=utf-8",
            );

            res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`,
            );

            return res.status(200).send(csv);
        },
        );
    
    static exportPurchasesReport = asyncHandler(
    async (req: Request, res: Response) => {
        const csv =
        await ReportService.exportPurchasesReport(
            req.query.date_from
            ? new Date(req.query.date_from.toString())
            : undefined,
            req.query.date_to
            ? new Date(req.query.date_to.toString())
            : undefined,
        );

        const fileName =
        `purchases-report-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        res.setHeader(
        "Content-Type",
        "text/csv; charset=utf-8",
        );

        res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
        );

        return res.status(200).send(csv);
    },
    );

    static exportInventoryReport = asyncHandler(
        async (req: Request, res: Response) => {
            const csv =
            await ReportService.exportInventoryReport(
                req.query.date_from
                ? new Date(req.query.date_from.toString())
                : undefined,
                req.query.date_to
                ? new Date(req.query.date_to.toString())
                : undefined,
            );

            const fileName =
            `inventory-report-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;

            res.setHeader(
            "Content-Type",
            "text/csv; charset=utf-8",
            );

            res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`,
            );

            return res.status(200).send(csv);
        },
        );
}