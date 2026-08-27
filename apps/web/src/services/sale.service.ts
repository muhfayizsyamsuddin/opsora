import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  CreateSaleInput,
  Sale,
  SaleInvoice,
  SaleListResponse,
  SaleQueryParams,
  UpdateSaleInput,
} from "@/features/sales/types/sale";

import type { ApiResponse } from "@/types/api";

export async function getSales(
  params?: SaleQueryParams,
): Promise<SaleListResponse> {
  const response =
    await api.get<ApiResponse<SaleListResponse>>(
      API.SALES,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getSaleById(
  id: string,
): Promise<Sale> {
  const response =
    await api.get<ApiResponse<Sale>>(
      `${API.SALES}/${id}`,
    );

  return response.data.data;
}

export async function createSale(
  data: CreateSaleInput,
): Promise<Sale> {
  const response =
    await api.post<ApiResponse<Sale>>(
      API.SALES,
      data,
    );

  return response.data.data;
}

export async function updateSale(
  id: string,
  data: UpdateSaleInput,
): Promise<Sale> {
  const response =
    await api.put<ApiResponse<Sale>>(
      `${API.SALES}/${id}`,
      data,
    );

  return response.data.data;
}

export async function paySale(
  id: string,
): Promise<Sale> {
  const response =
    await api.post<ApiResponse<Sale>>(
      `${API.SALES}/${id}/pay`,
    );

  return response.data.data;
}

export async function cancelSale(
  id: string,
): Promise<Sale> {
  const response =
    await api.post<ApiResponse<Sale>>(
      `${API.SALES}/${id}/cancel`,
    );

  return response.data.data;
}

export async function getSaleInvoice(
  id: string,
): Promise<SaleInvoice> {
  const response =
    await api.get<ApiResponse<SaleInvoice>>(
      `${API.SALES}/${id}/invoice`,
    );

  return response.data.data;
}

export async function downloadSaleInvoicePdf(
  id: string,
): Promise<Blob> {
  const response = await api.get(
    `${API.SALES}/${id}/invoice/pdf`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}