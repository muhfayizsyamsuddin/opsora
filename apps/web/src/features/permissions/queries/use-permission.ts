"use client";

import { useQuery } from "@tanstack/react-query";

import { getPermissionById } from "@/services/permission.service";

export function usePermission(
  id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["permissions", id],
    queryFn: () =>
      getPermissionById(id),
    enabled: Boolean(id) && enabled,
  });
}