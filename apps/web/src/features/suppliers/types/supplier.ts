export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SupplierListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface SupplierListResponse {
  data: Supplier[];
  meta: SupplierListMeta;
}

export interface SupplierQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
}

export interface CreateSupplierInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}