"use client";

import { useQuery } from "@tanstack/react-query";

import { getPurchaseById } from "@/services/purchase.service";

export function usePurchase(id?: string) {
  return useQuery({
    queryKey: ["purchases", id],
    queryFn: () => getPurchaseById(id!),
    enabled: Boolean(id),
  });
}