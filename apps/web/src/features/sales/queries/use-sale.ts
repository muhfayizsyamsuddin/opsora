"use client";

import { useQuery } from "@tanstack/react-query";

import { getSaleById } from "@/services/sale.service";

export function useSale(id?: string) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => getSaleById(id!),
    enabled: Boolean(id),
  });
}