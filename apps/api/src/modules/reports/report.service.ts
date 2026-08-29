import { ReportRepository } from "./report.repository.js";

function endOfDay(date?: Date) {
  if (!date) {
    return undefined;
  }

  const result = new Date(date);

  result.setHours(
    23,
    59,
    59,
    999,
  );

  return result;
}

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
        endOfDay(dateTo),
      );
    }

    static async getPurchasesReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getPurchasesReport(
        dateFrom,
        endOfDay(dateTo),
        );
    }

    static async getInventoryReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getInventoryReport(
        dateFrom,
        endOfDay(dateTo),
        );
    }

    static async getProfitReport(
        dateFrom?: Date,
        dateTo?: Date,
    ) {
        return ReportRepository.getProfitReport(
        dateFrom,
        endOfDay(dateTo),
        );
    }
}