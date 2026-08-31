"use client";

import { useQuery } from "@tanstack/react-query";

import { getPurchaseReturns } from "@/services/purchase-return.service";
import type { PurchaseReturnQueryParams } from "@/features/purchase-returns/types/purchase-return";

export function usePurchaseReturns(
  params: PurchaseReturnQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["purchase-returns", params],
    queryFn: () => getPurchaseReturns(params),
    enabled,
  });
}