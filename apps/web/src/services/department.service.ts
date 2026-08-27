import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  CreateDepartmentInput,
  Department,
  DepartmentListResponse,
  DepartmentQueryParams,
  UpdateDepartmentInput,
} from "@/features/departments/types/department";

export async function getDepartments(
  params?: DepartmentQueryParams,
): Promise<DepartmentListResponse> {
  const response =
    await api.get<
      ApiResponse<DepartmentListResponse>
    >(
      API.DEPARTMENTS,
      { params },
    );

  return response.data.data;
}

export async function getDepartmentById(
  id: string,
): Promise<Department> {
  const response =
    await api.get<ApiResponse<Department>>(
      `${API.DEPARTMENTS}/${id}`,
    );

  return response.data.data;
}

export async function createDepartment(
  data: CreateDepartmentInput,
): Promise<Department> {
  const response =
    await api.post<ApiResponse<Department>>(
      API.DEPARTMENTS,
      data,
    );

  return response.data.data;
}

export async function updateDepartment(
  id: string,
  data: UpdateDepartmentInput,
): Promise<Department> {
  const response =
    await api.put<ApiResponse<Department>>(
      `${API.DEPARTMENTS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteDepartment(
  id: string,
) {
  await api.delete(
    `${API.DEPARTMENTS}/${id}`,
  );
}