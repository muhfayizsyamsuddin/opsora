export type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type RoleQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
};

export type RoleListResponse = {
  data: Role[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type CreateRoleInput = {
  name: string;
  description?: string;
  permissions: string[];
};

export type UpdateRoleInput = {
  name?: string;
  description?: string;
};

export type UpdateRolePermissionsInput = {
  permissions: string[];
};