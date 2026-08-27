"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/category.service";
import type { CategoryQueryParams } from "@/features/categories/types/category";

export function useCategories(
  params: CategoryQueryParams = {},
) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
}