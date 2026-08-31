import { useQuery } from "@tanstack/react-query";

import { getUserPermissions } from "@/services/user.service";

export function useUserPermissions(
  id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["users", id, "permissions"],
    queryFn: () => getUserPermissions(id),
    enabled: Boolean(id) && enabled,
  });
}