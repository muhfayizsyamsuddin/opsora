"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategoryById } from "@/services/category.service";

export function useCategory(id?: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(id!),
    enabled: Boolean(id),
  });
}