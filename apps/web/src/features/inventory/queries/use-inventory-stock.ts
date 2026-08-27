"use client";

import { useQuery } from "@tanstack/react-query";

import { getInventoryStock } from "@/services/inventory.service";
import type { InventoryStockQueryParams } from "@/features/inventory/types/inventory";

export function useInventoryStock(
  params: InventoryStockQueryParams = {},
) {
  return useQuery({
    queryKey: ["inventory", "stock", params],
    queryFn: () => getInventoryStock(params),
  });
}