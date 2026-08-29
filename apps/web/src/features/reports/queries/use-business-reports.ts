"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getInventoryReport,
  getProfitReport,
  getPurchasesReport,
  getSalesReport,
  type ReportDateParams,
} from "@/services/report.service";

export function useBusinessReports(
  params: ReportDateParams,
  enabled = true,
) {
  const sales = useQuery({
    queryKey: ["reports", "sales", params],
    queryFn: () => getSalesReport(params),
    enabled,
  });

  const purchases = useQuery({
    queryKey: ["reports", "purchases", params],
    queryFn: () => getPurchasesReport(params),
    enabled,
  });

  const inventory = useQuery({
    queryKey: ["reports", "inventory", params],
    queryFn: () => getInventoryReport(params),
    enabled,
  });

  const profit = useQuery({
    queryKey: ["reports", "profit", params],
    queryFn: () => getProfitReport(params),
    enabled,
  });

  return {
    sales,
    purchases,
    inventory,
    profit,
    isLoading:
      sales.isLoading ||
      purchases.isLoading ||
      inventory.isLoading ||
      profit.isLoading,
    hasError:
      !!sales.error ||
      !!purchases.error ||
      !!inventory.error ||
      !!profit.error,
  };
}