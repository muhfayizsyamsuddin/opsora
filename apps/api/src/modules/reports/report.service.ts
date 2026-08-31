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

    static async exportSalesReport(
    dateFrom?: Date,
    dateTo?: Date,
    ) {
    const report =
        await this.getSalesReport(
        dateFrom,
        dateTo,
        );

    const rows = [
        ["Metric", "Value"],
        ["Total Sales", report.totalSales],
        ["Completed Sales", report.completedSales],
        ["Cancelled Sales", report.cancelledSales],
        [
        "Total Revenue",
        report.totalRevenue.toString(),
        ],
    ];

    return rows
        .map((row) =>
        row
            .map((value) => {
            const stringValue = String(value);

            return `"${stringValue.replace(/"/g, '""')}"`;
            })
            .join(","),
        )
        .join("\n");
    }

    static async exportPurchasesReport(
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const report =
      await this.getPurchasesReport(
        dateFrom,
        dateTo,
      );

    const rows = [
      ["Metric", "Value"],
      ["Total Purchases", report.totalPurchases],
      [
        "Completed Purchases",
        report.completedPurchases,
      ],
      [
        "Draft Purchases",
        report.draftPurchases,
      ],
      [
        "Cancelled Purchases",
        report.cancelledPurchases,
      ],
      [
        "Total Purchase Amount",
        report.totalPurchaseAmount.toString(),
      ],
    ];

    return rows
      .map((row) =>
        row
          .map((value) => {
            const stringValue = String(value);

            return `"${stringValue.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");
  }

  static async exportInventoryReport(
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const report =
      await this.getInventoryReport(
        dateFrom,
        dateTo,
      );

    const rows = [
      ["Metric", "Value"],
      ["Total Products", report.totalProducts],
      [
        "Active Products",
        report.totalActiveProducts,
      ],
      [
        "Total Stock Quantity",
        report.totalStockQuantity,
      ],
      [
        "Low Stock Count",
        report.lowStockCount,
      ],
      [
        "Total Stock In",
        report.totalStockIn.toString(),
      ],
      [
        "Total Stock Out",
        report.totalStockOut.toString(),
      ],
    ];

    return rows
      .map((row) =>
        row
          .map((value) => {
            const stringValue = String(value);

            return `"${stringValue.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");
  }
}