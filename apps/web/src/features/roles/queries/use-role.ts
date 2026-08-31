"use client";

import { useQuery } from "@tanstack/react-query";

import { getRoleById } from "@/services/role.service";

export function useRole(
  id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => getRoleById(id),
    enabled: Boolean(id) && enabled,
  });
}