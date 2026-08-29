"use client";

import { useQuery } from "@tanstack/react-query";

import { getSales } from "@/services/sale.service";
import type { SaleQueryParams } from "@/features/sales/types/sale";

export function useSales(
  params: SaleQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => getSales(params),
    enabled,
  });
}