import { api } from "@/lib/api";

export type Department = {
  id: string;
  name: string;
};

export type GetDepartmentsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "name" | "createdAt";
  order?: "asc" | "desc";
};

type DepartmentsResponse = {
  data: {
    data: Department[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type DepartmentResponse = {
  data: Department;
};

export async function getDepartments(
  params: GetDepartmentsParams = {},
) {
  const response = await api.get<DepartmentsResponse>(
    "/departments",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        sort: params.sort ?? "createdAt",
        order: params.order ?? "desc",
      },
    },
  );

  return response.data.data;
}

export async function getDepartmentById(
  id: string,
) {
  const response = await api.get<DepartmentResponse>(
    `/departments/${id}`,
  );

  return response.data.data;
}

export type CreateDepartmentPayload = {
  name: string;
};

export async function createDepartment(
  data: CreateDepartmentPayload,
) {
  const response = await api.post(
    "/departments",
    data,
  );

  return response.data;
}

export type UpdateDepartmentPayload = {
  name?: string;
};

export async function updateDepartment(
  id: string,
  data: UpdateDepartmentPayload,
) {
  const response = await api.patch(
    `/departments/${id}`,
    data,
  );

  return response.data;
}

export async function deleteDepartment(
  id: string,
) {
  const response = await api.delete(
    `/departments/${id}`,
  );

  return response.data;
}