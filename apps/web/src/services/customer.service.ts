import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  CreateCustomerInput,
  Customer,
  CustomerListResponse,
  CustomerQueryParams,
  UpdateCustomerInput,
} from "@/features/customers/types/customer";

import type { ApiResponse } from "@/types/api";

export async function getCustomers(
  params?: CustomerQueryParams,
): Promise<CustomerListResponse> {
  const response =
    await api.get<ApiResponse<CustomerListResponse>>(
      API.CUSTOMERS,
      {
        params,
      },
    );

  return response.data.data;
}

export async function getCustomerById(
  id: string,
): Promise<Customer> {
  const response =
    await api.get<ApiResponse<Customer>>(
      `${API.CUSTOMERS}/${id}`,
    );

  return response.data.data;
}

export async function createCustomer(
  data: CreateCustomerInput,
): Promise<Customer> {
  const response =
    await api.post<ApiResponse<Customer>>(
      API.CUSTOMERS,
      data,
    );

  return response.data.data;
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerInput,
): Promise<Customer> {
  const response =
    await api.put<ApiResponse<Customer>>(
      `${API.CUSTOMERS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteCustomer(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.CUSTOMERS}/${id}`,
  );
}