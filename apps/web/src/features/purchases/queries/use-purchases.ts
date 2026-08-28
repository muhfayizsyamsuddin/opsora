"use client";

import { useQuery } from "@tanstack/react-query";

import { getPurchases } from "@/services/purchase.service";
import type { PurchaseQueryParams } from "@/features/purchases/types/purchase";

export function usePurchases(
  params: PurchaseQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: () => getPurchases(params),
    enabled,
  });
}