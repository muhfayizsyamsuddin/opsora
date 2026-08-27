import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  Permission,
  PermissionListResponse,
  PermissionQueryParams,
} from "@/features/permissions/types/permission";

export async function getPermissions(
  params?: PermissionQueryParams,
): Promise<PermissionListResponse> {
  const response =
    await api.get<
      ApiResponse<PermissionListResponse>
    >(API.PERMISSIONS, {
      params,
    });

  return response.data.data;
}

export async function getPermissionById(
  id: string,
): Promise<Permission> {
  const response =
    await api.get<ApiResponse<Permission>>(
      `${API.PERMISSIONS}/${id}`,
    );

  return response.data.data;
}