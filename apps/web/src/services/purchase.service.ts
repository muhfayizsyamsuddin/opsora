import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  CreatePurchaseInput,
  Purchase,
  PurchaseListResponse,
  PurchaseQueryParams,
  UpdatePurchaseInput,
} from "@/features/purchases/types/purchase";

import type { ApiResponse } from "@/types/api";

export async function getPurchases(
  params?: PurchaseQueryParams,
): Promise<PurchaseListResponse> {
  const response =
    await api.get<ApiResponse<PurchaseListResponse>>(
      API.PURCHASES,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getPurchaseById(
  id: string,
): Promise<Purchase> {
  const response =
    await api.get<ApiResponse<Purchase>>(
      `${API.PURCHASES}/${id}`,
    );

  return response.data.data;
}

export async function createPurchase(
  data: CreatePurchaseInput,
): Promise<Purchase> {
  const response =
    await api.post<ApiResponse<Purchase>>(
      API.PURCHASES,
      data,
    );

  return response.data.data;
}

export async function updatePurchase(
  id: string,
  data: UpdatePurchaseInput,
): Promise<Purchase> {
  const response =
    await api.put<ApiResponse<Purchase>>(
      `${API.PURCHASES}/${id}`,
      data,
    );

  return response.data.data;
}

export async function completePurchase(
  id: string,
): Promise<Purchase> {
  const response =
    await api.post<ApiResponse<Purchase>>(
      `${API.PURCHASES}/${id}/complete`,
    );

  return response.data.data;
}

export async function cancelPurchase(
  id: string,
): Promise<Purchase> {
  const response =
    await api.post<ApiResponse<Purchase>>(
      `${API.PURCHASES}/${id}/cancel`,
    );

  return response.data.data;
}