import { useQuery } from "@tanstack/react-query";

import { getPayrollById } from "@/services/payroll.service";

export function usePayroll(id: string) {
  return useQuery({
    queryKey: ["payrolls", id],
    queryFn: () => getPayrollById(id),
    enabled: Boolean(id),
  });
}