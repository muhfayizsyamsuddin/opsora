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
) {
  const sales = useQuery({
    queryKey: ["reports", "sales", params],
    queryFn: () => getSalesReport(params),
  });

  const purchases = useQuery({
    queryKey: ["reports", "purchases", params],
    queryFn: () => getPurchasesReport(params),
  });

  const inventory = useQuery({
    queryKey: ["reports", "inventory", params],
    queryFn: () => getInventoryReport(params),
  });

  const profit = useQuery({
    queryKey: ["reports", "profit", params],
    queryFn: () => getProfitReport(params),
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