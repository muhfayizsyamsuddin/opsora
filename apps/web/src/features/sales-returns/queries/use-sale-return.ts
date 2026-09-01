"use client";

import { useQuery } from "@tanstack/react-query";

import { getSaleReturnById } from "@/services/sale-return.service";

export function useSaleReturn(
  id?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["sale-returns", id],
    queryFn: () => getSaleReturnById(id!),
    enabled: Boolean(id) && enabled,
  });
}