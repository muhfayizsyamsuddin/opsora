"use client";

import { useQuery } from "@tanstack/react-query";

import { getRecentTransactions } from "@/services/dashboard.service";

export function useRecentTransactions(
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard", "recent-transactions"],
    queryFn: getRecentTransactions,
    enabled,
  });
}