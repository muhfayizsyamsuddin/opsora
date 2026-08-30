"use client";

import { useQuery } from "@tanstack/react-query";

import { getDepartmentById } from "@/services/department.service";

export function useDepartment(
  id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => getDepartmentById(id),
    enabled: Boolean(id) && enabled,
  });
}