"use client";

import { useQuery } from "@tanstack/react-query";

import { getSupplierById } from "@/services/supplier.service";

export function useSupplier(
  id?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => getSupplierById(id!),
    enabled: Boolean(id) && enabled,
  });
}