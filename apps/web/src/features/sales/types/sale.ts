export type SaleStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod =
  | "CASH"
  | "TRANSFER"
  | "QRIS";

export interface SaleCustomer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SaleUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  roleRef: {
    id: string;
    name: string;
    description: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SaleProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  purchasePrice: string;
  sellingPrice: string;
  stock: string;
  minimumStock: string;
  unit: string;
  imageUrl: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  subtotal: string;
  createdAt: string;
  product: SaleProduct;
}

export interface Sale {
  id: string;
  customerId: string | null;
  userId: string;
  saleDate: string;
  subtotal: string;
  discount: string;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  createdAt: string;
  updatedAt: string;
  customer: SaleCustomer | null;
  user: SaleUser;
  items: SaleItem[];
}

export interface SaleListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface SaleListResponse {
  data: Sale[];
  meta: SaleListMeta;
}

export interface SaleQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?:
    | "saleDate"
    | "createdAt"
    | "totalAmount";
  sort_order?: "asc" | "desc";
}

export interface SaleItemInput {
  productId: string;
  quantity: number;
  discount: number;
}

export interface CreateSaleInput {
  customerId?: string;
  saleDate: string;
  paymentMethod: PaymentMethod;
  discount: number;
  items: SaleItemInput[];
}

export interface UpdateSaleInput {
  customerId?: string | null;
  saleDate?: string;
  paymentMethod?: PaymentMethod;
  discount?: number;
  items?: SaleItemInput[];
}

export interface SaleInvoice {
  invoiceNumber: string;
  saleId: string;
  saleDate: string;
  paymentMethod: PaymentMethod;

  customer: {
    id: string;
    name: string;
  } | null;

  cashier: {
    id: string;
    name: string;
    email: string;
  };

  items: {
    productId: string;
    productName: string;
    quantity: string;
    unitPrice: string;
    discount: string;
    subtotal: string;
  }[];

  subtotal: string;
  discount: string;
  totalAmount: string;
  status: "COMPLETED";
}