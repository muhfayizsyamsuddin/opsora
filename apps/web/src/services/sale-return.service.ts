import { API } from "@/constants/api";
import type {
  CreateSaleReturnPayload,
  SaleReturn,
  SaleReturnListResponse,
  SaleReturnQueryParams,
} from "@/features/sales-returns/types/sale-return";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export async function getSaleReturns(
  params?: SaleReturnQueryParams,
): Promise<SaleReturnListResponse> {
  const response =
    await api.get<
      ApiResponse<SaleReturnListResponse>
    >(API.SALE_RETURNS, {
      params,
    });

  return response.data.data;
}

export async function getSaleReturnById(
  id: string,
): Promise<SaleReturn> {
  const response =
    await api.get<ApiResponse<SaleReturn>>(
      `${API.SALE_RETURNS}/${id}`,
    );

  return response.data.data;
}

export async function createSaleReturn(
  data: CreateSaleReturnPayload,
): Promise<SaleReturn> {
  const response =
    await api.post<ApiResponse<SaleReturn>>(
      API.SALE_RETURNS,
      data,
    );

  return response.data.data;
}

export async function completeSaleReturn(
  id: string,
): Promise<SaleReturn> {
  const response =
    await api.post<ApiResponse<SaleReturn>>(
      `${API.SALE_RETURNS}/${id}/complete`,
    );

  return response.data.data;
}

export async function cancelSaleReturn(
  id: string,
): Promise<SaleReturn> {
  const response =
    await api.post<ApiResponse<SaleReturn>>(
      `${API.SALE_RETURNS}/${id}/cancel`,
    );

  return response.data.data;
}