"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomers } from "@/services/customer.service";
import type { CustomerQueryParams } from "@/features/customers/types/customer";

export function useCustomers(
  params: CustomerQueryParams = {},
) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
  });
}