"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerById } from "@/services/customer.service";

export function useCustomer(
  id?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomerById(id!),
    enabled: Boolean(id) && enabled,
  });
}