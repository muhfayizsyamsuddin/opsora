"use client";

import { useQuery } from "@tanstack/react-query";

import { getDepartments } from "@/services/department.service";

import type {
  DepartmentQueryParams,
} from "@/features/departments/types/department";

export function useDepartments(
  params: DepartmentQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
    enabled,
  });
}