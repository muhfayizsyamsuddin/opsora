import { API } from "@/constants/api";
import type {
  CreatePurchaseReturnInput,
  PurchaseReturn,
  PurchaseReturnListResponse,
  PurchaseReturnQueryParams,
} from "@/features/purchase-returns/types/purchase-return";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export async function getPurchaseReturns(
  params?: PurchaseReturnQueryParams,
): Promise<PurchaseReturnListResponse> {
  const response =
    await api.get<
      ApiResponse<PurchaseReturnListResponse>
    >(API.PURCHASE_RETURNS, {
      params,
    });

  return response.data.data;
}

export async function getPurchaseReturnById(
  id: string,
): Promise<PurchaseReturn> {
  const response =
    await api.get<ApiResponse<PurchaseReturn>>(
      `${API.PURCHASE_RETURNS}/${id}`,
    );

  return response.data.data;
}

export async function createPurchaseReturn(
  data: CreatePurchaseReturnInput,
): Promise<PurchaseReturn> {
  const response =
    await api.post<ApiResponse<PurchaseReturn>>(
      API.PURCHASE_RETURNS,
      data,
    );

  return response.data.data;
}

export async function completePurchaseReturn(
  id: string,
): Promise<PurchaseReturn> {
  const response =
    await api.post<ApiResponse<PurchaseReturn>>(
      `${API.PURCHASE_RETURNS}/${id}/complete`,
    );

  return response.data.data;
}

export async function cancelPurchaseReturn(
  id: string,
): Promise<PurchaseReturn> {
  const response =
    await api.post<ApiResponse<PurchaseReturn>>(
      `${API.PURCHASE_RETURNS}/${id}/cancel`,
    );

  return response.data.data;
}