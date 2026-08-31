"use client";

import { useQuery } from "@tanstack/react-query";

import { getPurchaseReturnById } from "@/services/purchase-return.service";

export function usePurchaseReturn(
  id?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["purchase-returns", id],
    queryFn: () => getPurchaseReturnById(id!),
    enabled: Boolean(id) && enabled,
  });
}