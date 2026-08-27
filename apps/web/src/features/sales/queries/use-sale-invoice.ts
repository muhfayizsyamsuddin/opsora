"use client";

import { useQuery } from "@tanstack/react-query";

import { getSaleInvoice } from "@/services/sale.service";

export function useSaleInvoice(id?: string) {
  return useQuery({
    queryKey: ["sales", id, "invoice"],
    queryFn: () => getSaleInvoice(id!),
    enabled: Boolean(id),
  });
}