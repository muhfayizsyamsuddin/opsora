import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  AttendanceReport,
  DashboardReport,
  InventoryReport,
  LeaveReport,
  PayrollReport,
  PerformanceReport,
  ProfitReport,
  PurchasesReport,
  SalesReport,
} from "@/features/reports/types/report";

import type { ApiResponse } from "@/types/api";

export async function getDashboardReport(): Promise<DashboardReport> {
  const response =
    await api.get<ApiResponse<DashboardReport>>(
      `${API.REPORTS}/dashboard`,
    );

  return response.data.data;
}

export type ReportDateParams = {
  date_from?: string;
  date_to?: string;
};

export async function getSalesReport(
  params?: ReportDateParams,
): Promise<SalesReport> {
  const response =
    await api.get<ApiResponse<SalesReport>>(
      `${API.REPORTS}/sales`,
      { params },
    );

  return response.data.data;
}

export async function exportSalesReport(
  params?: ReportDateParams,
): Promise<Blob> {
  const response = await api.get(
    `${API.REPORTS}/sales/export`,
    {
      params,
      responseType: "blob",
    },
  );

  return response.data;
}

export async function getPurchasesReport(
  params?: ReportDateParams,
): Promise<PurchasesReport> {
  const response =
    await api.get<ApiResponse<PurchasesReport>>(
      `${API.REPORTS}/purchases`,
      { params },
    );

  return response.data.data;
}

export async function exportPurchasesReport(
  params?: ReportDateParams,
): Promise<Blob> {
  const response = await api.get(
    `${API.REPORTS}/purchases/export`,
    {
      params,
      responseType: "blob",
    },
  );

  return response.data;
}

export async function getInventoryReport(
  params?: ReportDateParams,
): Promise<InventoryReport> {
  const response =
    await api.get<ApiResponse<InventoryReport>>(
      `${API.REPORTS}/inventory`,
      { params },
    );

  return response.data.data;
}

export async function exportInventoryReport(
  params?: ReportDateParams,
): Promise<Blob> {
  const response = await api.get(
    `${API.REPORTS}/inventory/export`,
    {
      params,
      responseType: "blob",
    },
  );

  return response.data;
}

export async function getProfitReport(
  params?: ReportDateParams,
): Promise<ProfitReport> {
  const response =
    await api.get<ApiResponse<ProfitReport>>(
      `${API.REPORTS}/profit`,
      { params },
    );

  return response.data.data;
}

export async function getPerformanceReport(): Promise<PerformanceReport> {
  const response =
    await api.get<ApiResponse<PerformanceReport>>(
      `${API.REPORTS}/performance`,
    );

  return response.data.data;
}

export async function getAttendanceReport(): Promise<AttendanceReport> {
  const response =
    await api.get<ApiResponse<AttendanceReport>>(
      `${API.REPORTS}/attendance`,
    );

  return response.data.data;
}

export async function getLeaveReport(): Promise<LeaveReport> {
  const response =
    await api.get<ApiResponse<LeaveReport>>(
      `${API.REPORTS}/leaves`,
    );

  return response.data.data;
}

export async function getPayrollReport(): Promise<PayrollReport> {
  const response =
    await api.get<ApiResponse<PayrollReport>>(
      `${API.REPORTS}/payroll`,
    );

  return response.data.data;
}