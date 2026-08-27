"use client";

import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/product.service";
import type { ProductQueryParams } from "@/features/products/types/product";

export function useProducts(
  params: ProductQueryParams,
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}