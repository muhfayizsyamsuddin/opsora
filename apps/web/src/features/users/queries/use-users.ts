import { useQuery } from "@tanstack/react-query";

import { getUsers } from "@/services/user.service";

import type { UserQueryParams } from "@/features/users/types/user";

export function useUsers(
  params?: UserQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    enabled,
  });
}