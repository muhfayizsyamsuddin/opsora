import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  CreateSupplierInput,
  Supplier,
  SupplierListResponse,
  SupplierQueryParams,
  UpdateSupplierInput,
} from "@/features/suppliers/types/supplier";

import type { ApiResponse } from "@/types/api";

export async function getSuppliers(
  params?: SupplierQueryParams,
): Promise<SupplierListResponse> {
  const response =
    await api.get<ApiResponse<SupplierListResponse>>(
      API.SUPPLIERS,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getSupplierById(
  id: string,
): Promise<Supplier> {
  const response =
    await api.get<ApiResponse<Supplier>>(
      `${API.SUPPLIERS}/${id}`,
    );

  return response.data.data;
}

export async function createSupplier(
  data: CreateSupplierInput,
): Promise<Supplier> {
  const response =
    await api.post<ApiResponse<Supplier>>(
      API.SUPPLIERS,
      data,
    );

  return response.data.data;
}

export async function updateSupplier(
  id: string,
  data: UpdateSupplierInput,
): Promise<Supplier> {
  const response =
    await api.put<ApiResponse<Supplier>>(
      `${API.SUPPLIERS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteSupplier(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.SUPPLIERS}/${id}`,
  );
}