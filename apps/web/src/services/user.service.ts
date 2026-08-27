import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  User,
  UserListResponse,
  UserQueryParams,
  CreateUserInput,
  UpdateUserInput,
  AssignUserRoleInput,
  UserPermissionsResponse,
} from "@/features/users/types/user";

export async function getUsers(
  params?: UserQueryParams,
): Promise<UserListResponse> {
  const response =
    await api.get<ApiResponse<UserListResponse>>(
      API.USERS,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getUserById(
  id: string,
): Promise<User> {
  const response =
    await api.get<ApiResponse<User>>(
      `${API.USERS}/${id}`,
    );

  return response.data.data;
}

export async function createUser(
  data: CreateUserInput,
): Promise<User> {
  const response =
    await api.post<ApiResponse<User>>(
      API.USERS,
      data,
    );

  return response.data.data;
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<User> {
  const response =
    await api.put<ApiResponse<User>>(
      `${API.USERS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function assignUserRole(
  id: string,
  data: AssignUserRoleInput,
): Promise<User> {
  const response =
    await api.put<ApiResponse<User>>(
      `${API.USERS}/${id}/roles`,
      data,
    );

  return response.data.data;
}

export async function getUserPermissions(
  id: string,
): Promise<UserPermissionsResponse> {
  const response =
    await api.get<
      ApiResponse<UserPermissionsResponse>
    >(
      `${API.USERS}/${id}/permissions`,
    );

  return response.data.data;
}

export async function deleteUser(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.USERS}/${id}`,
  );
}

export async function getCurrentUser(): Promise<User> {
  const response =
    await api.get<ApiResponse<User>>(
      `${API.USERS}/me`,
    );

  return response.data.data;
}