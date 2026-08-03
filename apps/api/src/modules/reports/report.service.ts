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
}