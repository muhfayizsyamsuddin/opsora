import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  InventoryStock,
  InventoryStockQueryParams,
  InventoryStockResponse,
  InventoryMovement,
  InventoryMovementListResponse,
  InventoryMovementQueryParams,
} from "@/features/inventory/types/inventory";

import type { ApiResponse } from "@/types/api";

export async function getInventoryStock(
  params?: InventoryStockQueryParams,
): Promise<InventoryStockResponse> {
  const response =
    await api.get<
      ApiResponse<InventoryStockResponse>
    >(`${API.INVENTORY}/stock`, {
      params,
    });

  return response.data.data;
}

export async function getInventoryStockByProduct(
  productId: string,
): Promise<InventoryStock> {
  const response =
    await api.get<ApiResponse<InventoryStock>>(
      `${API.INVENTORY}/stock/${productId}`,
    );

  return response.data.data;
}

export async function getInventoryMovements(
  params?: InventoryMovementQueryParams,
): Promise<InventoryMovementListResponse> {
  const response =
    await api.get<
      ApiResponse<InventoryMovementListResponse>
    >(`${API.INVENTORY}/movements`, {
      params,
    });

  return response.data.data;
}

export async function getInventoryMovementById(
  id: string,
): Promise<InventoryMovement> {
  const response =
    await api.get<ApiResponse<InventoryMovement>>(
      `${API.INVENTORY}/movements/${id}`,
    );

  return response.data.data;
}

export interface CreateInventoryAdjustmentInput {
  product_id: string;
  movement_type: "IN" | "OUT";
  quantity: number;
  reason: string;
}

export async function createInventoryAdjustment(
  data: CreateInventoryAdjustmentInput,
): Promise<InventoryMovement> {
  const response =
    await api.post<ApiResponse<InventoryMovement>>(
      `${API.INVENTORY}/adjustments`,
      data,
    );

  return response.data.data;
}