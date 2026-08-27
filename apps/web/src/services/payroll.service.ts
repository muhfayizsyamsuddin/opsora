import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  Payroll,
  PayrollListResponse,
  PayrollQueryParams,
  CreatePayrollInput,
} from "@/features/payrolls/types/payroll";

export async function getPayrolls(
  params?: PayrollQueryParams,
): Promise<PayrollListResponse> {
  const response =
    await api.get<
      ApiResponse<PayrollListResponse>
    >(API.PAYROLLS, {
      params,
    });

  return response.data.data;
}

export async function getPayrollById(
  id: string,
): Promise<Payroll> {
  const response =
    await api.get<ApiResponse<Payroll>>(
      `${API.PAYROLLS}/${id}`,
    );

  return response.data.data;
}

export async function createPayroll(
  data: CreatePayrollInput,
): Promise<Payroll> {
  const response =
    await api.post<ApiResponse<Payroll>>(
      API.PAYROLLS,
      data,
    );

  return response.data.data;
}

export async function deletePayroll(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.PAYROLLS}/${id}`,
  );
}