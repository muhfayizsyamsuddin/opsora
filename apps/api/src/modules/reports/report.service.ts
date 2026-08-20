import { ReportRepository } from "./report.repository.js";

export class ReportService {
    static async getDashboardReport() {
        return ReportRepository.getDashboardReport();
    }

    static async getAttendanceReport() {
        return ReportRepository.getAttendanceReport();
    }

    static async getLeaveReport() {
        return ReportRepository.getLeaveReport();
    }

    static async getPayrollReport() {
        return ReportRepository.getPayrollReport();
    }

    static async getPerformanceReport() {
        return ReportRepository.getPerformanceReport();
    }

    static async getSalesReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getSalesReport(
        dateFrom,
        dateTo,
        );
    }

    static async getPurchasesReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getPurchasesReport(
        dateFrom,
        dateTo,
        );
    }

    static async getInventoryReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getInventoryReport(
        dateFrom,
        dateTo,
        );
    }

    static async getProfitReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getProfitReport(
        dateFrom,
        dateTo,
        );
    }
}