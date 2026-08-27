export type Department = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
};

export type DepartmentListResponse = {
  data: Department[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type CreateDepartmentInput = {
  name: string;
};

export type UpdateDepartmentInput = {
  name?: string;
};