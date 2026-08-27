export type Permission = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PermissionListResponse = {
  data: Permission[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PermissionQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
};