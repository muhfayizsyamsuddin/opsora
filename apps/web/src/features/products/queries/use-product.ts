"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById } from "@/services/product.service";

export function useProduct(
  id?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id) && enabled,
  });
}