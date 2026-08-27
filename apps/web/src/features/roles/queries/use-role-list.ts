"use client";

import { useQuery } from "@tanstack/react-query";

import { getRoles } from "@/services/role.service";

import type {
  RoleQueryParams,
} from "@/features/roles/types/role";

export function useRoleList(
  params?: RoleQueryParams,
) {
  return useQuery({
    queryKey: ["roles", "list", params],
    queryFn: () => getRoles(params),
  });
}