export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CategoryListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CategoryListResponse {
  data: Category[];
  meta: CategoryListMeta;
}

export interface CategoryQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}