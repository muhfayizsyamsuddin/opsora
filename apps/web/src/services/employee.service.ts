import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  CreateEmployeeInput,
  Employee,
  EmployeeListResponse,
  EmployeeQueryParams,
  UpdateEmployeeInput,
} from "@/features/employees/types/employee";

export async function getEmployees(
  params?: EmployeeQueryParams,
): Promise<EmployeeListResponse> {
  const response =
    await api.get<
      ApiResponse<EmployeeListResponse>
    >(
      API.EMPLOYEES,
      { params },
    );

  return response.data.data;
}

export async function getEmployeeById(
  id: string,
): Promise<Employee> {
  const response =
    await api.get<ApiResponse<Employee>>(
      `${API.EMPLOYEES}/${id}`,
    );

  return response.data.data;
}

export async function createEmployee(
  data: CreateEmployeeInput,
): Promise<Employee> {
  const response =
    await api.post<ApiResponse<Employee>>(
      API.EMPLOYEES,
      data,
    );

  return response.data.data;
}

export async function updateEmployee(
  id: string,
  data: UpdateEmployeeInput,
): Promise<Employee> {
  const response =
    await api.put<ApiResponse<Employee>>(
      `${API.EMPLOYEES}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteEmployee(
  id: string,
) {
  await api.delete(
    `${API.EMPLOYEES}/${id}`,
  );
}