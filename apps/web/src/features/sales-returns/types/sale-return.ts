export type SaleReturnStatus = "DRAFT" | "COMPLETED" | "CANCELLED";

export interface SaleReturnCustomer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface SaleReturnProduct {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: string;
}

export interface SaleReturnSaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  subtotal: string;
}

export interface SaleReturnItem {
  id: string;
  saleReturnId: string;
  saleItemId: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  createdAt: string;
  saleItem: SaleReturnSaleItem;
  product: SaleReturnProduct;
}

export interface SaleReturnSale {
  id: string;
  customerId: string | null;
  userId: string;
  saleDate: string;
  subtotal: string;
  discount: string;
  totalAmount: string;
  paymentMethod: string;
  status: string;
  customer: SaleReturnCustomer | null;
}

export interface SaleReturnUser {
  id: string;
  name: string;
  email: string;
}

export interface SaleReturn {
  id: string;
  saleId: string;
  userId: string;
  returnDate: string;
  reason: string | null;
  status: SaleReturnStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  sale: SaleReturnSale;
  user: SaleReturnUser;
  items: SaleReturnItem[];
}

export interface SaleReturnListResponse {
  data: SaleReturn[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface SaleReturnQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: SaleReturnStatus;
  sale_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: "returnDate" | "createdAt" | "totalAmount";
  sort_order?: "asc" | "desc";
}

export interface CreateSaleReturnPayload {
  saleId: string;
  returnDate: string;
  reason?: string;
  items: {
    saleItemId: string;
    quantity: number;
  }[];
}