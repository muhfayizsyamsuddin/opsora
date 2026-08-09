import { api } from "@/lib/api";

export type Department = {
  id: string;
  name: string;
};

type DepartmentResponse = {
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

export async function getDepartments() {
  const response = await api.get<DepartmentResponse>(
    "/departments",
    {
      params: {
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      },
    },
  );

  return response.data.data.data;
}