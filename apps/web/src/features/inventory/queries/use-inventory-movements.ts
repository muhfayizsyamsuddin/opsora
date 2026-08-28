"use client";

import { useQuery } from "@tanstack/react-query";

import { getInventoryMovements } from "@/services/inventory.service";
import type { InventoryMovementQueryParams } from "@/features/inventory/types/inventory";

export function useInventoryMovements(
  params: InventoryMovementQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "inventory",
      "movements",
      params,
    ],
    queryFn: () =>
      getInventoryMovements(params),
    enabled,
  });
}