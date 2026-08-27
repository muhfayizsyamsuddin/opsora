export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE";

export type ProductStockStatus =
  | "LOW";

export type ProductSortBy =
  | "name"
  | "sku"
  | "createdAt";

export type SortOrder =
  | "asc"
  | "desc";

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  sku: string;
  barcode: string | null;
  purchasePrice: string;
  sellingPrice: string;
  stock: string;
  minimumStock: string;
  unit: string;
  imageUrl: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: ProductCategory;
}

export interface ProductListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductListMeta;
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  status?: ProductStatus;
  stock_status?: ProductStockStatus;
  sort_by?: ProductSortBy;
  sort_order?: SortOrder;
}

export interface CreateProductInput {
  categoryId: string;
  name: string;
  sku: string;
  barcode?: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  imageUrl?: string;
  status: ProductStatus;
}

export interface UpdateProductInput {
  categoryId?: string;
  name?: string;
  sku?: string;
  barcode?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  minimumStock?: number;
  unit?: string;
  status?: ProductStatus;
  imageUrl?: string;
}