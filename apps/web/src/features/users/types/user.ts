export type User = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  roleId: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserListResponse = {
  data: User[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type UserQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  role_id?: string;
  sort_by?: "name" | "email" | "createdAt";
  sort_order?: "asc" | "desc";
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  roleId: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  roleId?: string;
};

export type AssignUserRoleInput = {
  roleId: string;
};

export type UserPermissionsResponse = {
  userId: string;
  role: string | null;
  permissions: string[];
};