import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  Product,
  ProductListResponse,
  ProductQueryParams,
  CreateProductInput,
  UpdateProductInput,
} from "@/features/products/types/product";

import type { ApiResponse } from "@/types/api";

export async function getProducts(
  params?: ProductQueryParams,
): Promise<ProductListResponse> {
  const response =
    await api.get<ApiResponse<ProductListResponse>>(
      API.PRODUCTS,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getProductById(
  id: string,
): Promise<Product> {
  const response =
    await api.get<ApiResponse<Product>>(
      `${API.PRODUCTS}/${id}`,
    );

  return response.data.data;
}

export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  const response =
    await api.post<ApiResponse<Product>>(
      API.PRODUCTS,
      data,
    );

  return response.data.data;
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<Product> {
  const response =
    await api.put<ApiResponse<Product>>(
      `${API.PRODUCTS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteProduct(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.PRODUCTS}/${id}`,
  );
}

export async function uploadProductImage(
  id: string,
  file: File,
): Promise<Product> {
  const formData = new FormData();

  formData.append("image", file);

  const response =
    await api.post<ApiResponse<Product>>(
      `${API.PRODUCTS}/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return response.data.data;
}