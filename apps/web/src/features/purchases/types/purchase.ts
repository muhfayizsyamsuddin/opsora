export type PurchaseStatus =
  | "DRAFT"
  | "COMPLETED"
  | "CANCELLED";

export interface PurchaseSupplier {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface PurchaseUser {
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

export interface PurchaseProduct {
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

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  product: PurchaseProduct;
}

export interface Purchase {
  id: string;
  supplierId: string;
  userId: string;
  purchaseDate: string;
  totalAmount: string;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
  supplier: PurchaseSupplier;
  user: PurchaseUser;
  items: PurchaseItem[];
}

export interface PurchaseListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PurchaseListResponse {
  data: Purchase[];
  meta: PurchaseListMeta;
}

export interface PurchaseQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  supplier_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?:
    | "purchaseDate"
    | "createdAt"
    | "totalAmount";
  sort_order?: "asc" | "desc";
}

export interface PurchaseItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseInput {
  supplierId: string;
  purchaseDate: string;
  items: PurchaseItemInput[];
}

export interface UpdatePurchaseInput {
  supplierId?: string;
  purchaseDate?: string;
  items?: PurchaseItemInput[];
}