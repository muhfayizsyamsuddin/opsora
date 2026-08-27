import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";
import type {
  Role,
  RoleListResponse,
  RoleQueryParams,
  CreateRoleInput,
  UpdateRoleInput,
  UpdateRolePermissionsInput,
} from "@/features/roles/types/role";

export async function getRoles(
  params?: RoleQueryParams,
): Promise<RoleListResponse> {
  const response = await api.get<
    ApiResponse<RoleListResponse>
  >(API.ROLES, {
    params,
  });

  return response.data.data;
}

export async function getRoleById(
  id: string,
): Promise<Role> {
  const response =
    await api.get<ApiResponse<Role>>(
      `${API.ROLES}/${id}`,
    );

  return response.data.data;
}

export async function createRole(
  data: CreateRoleInput,
): Promise<Role> {
  const response =
    await api.post<ApiResponse<Role>>(
      API.ROLES,
      data,
    );

  return response.data.data;
}

export async function updateRole(
  id: string,
  data: UpdateRoleInput,
): Promise<Role> {
  const response =
    await api.put<ApiResponse<Role>>(
      `${API.ROLES}/${id}`,
      data,
    );

  return response.data.data;
}

export async function updateRolePermissions(
  id: string,
  data: UpdateRolePermissionsInput,
): Promise<Role> {
  const response =
    await api.put<ApiResponse<Role>>(
      `${API.ROLES}/${id}/permissions`,
      data,
    );

  return response.data.data;
}

export async function deleteRole(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.ROLES}/${id}`,
  );
}