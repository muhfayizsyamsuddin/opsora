import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  Category,
  CategoryListResponse,
  CategoryQueryParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/categories/types/category";

import type { ApiResponse } from "@/types/api";

export async function getCategories(
  params?: CategoryQueryParams,
): Promise<CategoryListResponse> {
  const response =
    await api.get<ApiResponse<CategoryListResponse>>(
      API.CATEGORIES,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getCategoryById(
  id: string,
): Promise<Category> {
  const response =
    await api.get<ApiResponse<Category>>(
      `${API.CATEGORIES}/${id}`,
    );

  return response.data.data;
}

export async function createCategory(
  data: CreateCategoryInput,
): Promise<Category> {
  const response =
    await api.post<ApiResponse<Category>>(
      API.CATEGORIES,
      data,
    );

  return response.data.data;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> {
  const response =
    await api.put<ApiResponse<Category>>(
      `${API.CATEGORIES}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteCategory(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.CATEGORIES}/${id}`,
  );
}