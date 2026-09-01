"use client";

import { useQuery } from "@tanstack/react-query";

import { getSaleReturns } from "@/services/sale-return.service";
import type { SaleReturnQueryParams } from "@/features/sales-returns/types/sale-return";

export function useSaleReturns(
  params: SaleReturnQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["sale-returns", params],
    queryFn: () => getSaleReturns(params),
    enabled,
  });
}