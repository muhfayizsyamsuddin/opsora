"use client";

import { useQuery } from "@tanstack/react-query";

import { getLowStockProducts } from "@/services/dashboard.service";

export function useLowStock(
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard", "low-stock"],
    queryFn: getLowStockProducts,
    enabled,
  });
}