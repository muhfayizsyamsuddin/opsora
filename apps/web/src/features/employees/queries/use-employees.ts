"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployees } from "@/services/employee.service";

import type {
  EmployeeQueryParams,
} from "@/features/employees/types/employee";

export function useEmployees(
  params: EmployeeQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
    enabled,
  });
}