"use client";

import { useQuery } from "@tanstack/react-query";

import { getInventoryMovementById } from "@/services/inventory.service";

export function useInventoryMovement(
  id?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "inventory",
      "movements",
      id,
    ],
    queryFn: () =>
      getInventoryMovementById(id!),
    enabled: Boolean(id) && enabled,
  });
}