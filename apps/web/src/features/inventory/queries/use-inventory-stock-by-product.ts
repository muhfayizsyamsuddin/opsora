"use client";

import { useQuery } from "@tanstack/react-query";

import { getInventoryStockByProduct } from "@/services/inventory.service";

export function useInventoryStockByProduct(
  productId?: string,
) {
  return useQuery({
    queryKey: [
      "inventory",
      "stock",
      productId,
    ],
    queryFn: () =>
      getInventoryStockByProduct(
        productId!,
      ),
    enabled: Boolean(productId),
  });
}