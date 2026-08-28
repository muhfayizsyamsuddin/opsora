export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CustomerListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface CustomerListResponse {
  data: Customer[];
  meta: CustomerListMeta;
}

export interface CustomerQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
}

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}