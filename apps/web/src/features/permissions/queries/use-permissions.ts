"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getPermissions,
} from "@/services/permission.service";

import type {
  PermissionQueryParams,
} from "@/features/permissions/types/permission";

export function usePermissionsQuery(
  params?: PermissionQueryParams,
) {
  return useQuery({
    queryKey: ["permissions", params],
    queryFn: () => getPermissions(params),
  });
}