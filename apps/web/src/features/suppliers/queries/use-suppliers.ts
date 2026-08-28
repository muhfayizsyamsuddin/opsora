"use client";

import { useQuery } from "@tanstack/react-query";

import { getSuppliers } from "@/services/supplier.service";
import type { SupplierQueryParams } from "@/features/suppliers/types/supplier";

export function useSuppliers(
  params: SupplierQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
    enabled,
  });
}