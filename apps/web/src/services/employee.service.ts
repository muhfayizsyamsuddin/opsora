import { api } from "@/lib/api";

export type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
  status: "ACTIVE" | "INACTIVE";
  department: {
    id: string;
    name: string;
  };
};

type EmployeesResponse = {
  data: {
    data: Employee[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type GetEmployeesParams = {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: "ACTIVE" | "INACTIVE";
  sort?: "name" | "salary" | "hireDate" | "createdAt";
  order?: "asc" | "desc";
};

export type UpdateEmployeePayload = {
  name?: string;
  email?: string;
  position?: string;
  salary?: number;
  hireDate?: string;
  departmentId?: string;
  status?: "ACTIVE" | "INACTIVE";
};

export async function getEmployees(
  params: GetEmployeesParams = {},
) {
  const response = await api.get<EmployeesResponse>(
    "/employees",
    {
      params,
    },
  );

  return response.data.data;
}

export async function getEmployeeById(id: string) {
  const response = await api.get<{
    data: Employee;
  }>(`/employees/${id}`);

  return response.data.data;
}

export type CreateEmployeePayload = {
  name: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
  departmentId: string;
};

export async function createEmployee(
  data: CreateEmployeePayload,
) {
  const response = await api.post(
    "/employees",
    data,
  );

  return response.data;
}

export async function updateEmployee(
  id: string,
  data: UpdateEmployeePayload,
) {
  const response = await api.patch<{
    data: Employee;
  }>(`/employees/${id}`, data);

  return response.data.data;
}

export async function deleteEmployee(id: string) {
  await api.delete(`/employees/${id}`);
}