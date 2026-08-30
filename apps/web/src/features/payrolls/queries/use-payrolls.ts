import { useQuery } from "@tanstack/react-query";

import { getPayrolls } from "@/services/payroll.service";

import type { PayrollQueryParams } from "@/features/payrolls/types/payroll";

export function usePayrolls(
  params?: PayrollQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["payrolls", params],
    queryFn: () => getPayrolls(params),
    enabled,
  });
}