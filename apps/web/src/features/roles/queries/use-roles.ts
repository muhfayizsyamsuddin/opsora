import { useQuery } from "@tanstack/react-query";

import { getRoles } from "@/services/role.service";

export function useRoles(
  enabled = true,
) {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      getRoles({
        page: 1,
        per_page: 100,
        sort_by: "name",
        sort_order: "asc",
      }),
    enabled,
  });
}