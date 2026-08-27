import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  DashboardSummary,
  RecentTransaction,
  LowStockProduct,
  PeopleSummary,
} from "@/features/dashboard/types/dashboard";

import type { ApiResponse } from "@/types/api";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response =
    await api.get<ApiResponse<DashboardSummary>>(
      `${API.DASHBOARD}/summary`,
    );

  return response.data.data;
}

export async function getRecentTransactions(): Promise<
  RecentTransaction[]
> {
  const response =
    await api.get<ApiResponse<RecentTransaction[]>>(
      `${API.DASHBOARD}/recent-transactions`,
    );

  return response.data.data;
}

export async function getLowStockProducts(): Promise<
  LowStockProduct[]
> {
  const response =
    await api.get<ApiResponse<LowStockProduct[]>>(
      `${API.DASHBOARD}/low-stock`,
    );

  return response.data.data;
}

export async function getPeopleSummary(): Promise<PeopleSummary> {
  const response =
    await api.get<ApiResponse<PeopleSummary>>(
      `${API.DASHBOARD}/people-summary`,
    );

  return response.data.data;
}