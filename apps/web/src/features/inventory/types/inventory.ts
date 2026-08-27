export type InventoryStock = {
  id: string;
  name: string;
  sku: string;
  stock: string;
  minimumStock: string;
  unit: string;
  status: "ACTIVE" | "INACTIVE";
};

export type InventoryStockMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type InventoryStockResponse = {
  data: InventoryStock[];
  meta: InventoryStockMeta;
};

export type InventoryStockQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
};

export type InventoryMovementType =
  | "IN"
  | "OUT";

export type InventoryReferenceType =
  | "PURCHASE"
  | "SALE"
  | "ADJUSTMENT";

export interface InventoryMovementProduct {
  id: string;
  name: string;
  sku: string;
  unit: string;
}

export interface InventoryMovementUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roleRef: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface InventoryMovement {
  id: string;
  productId: string;
  userId: string;
  movementType: InventoryMovementType;
  referenceType: InventoryReferenceType;
  referenceId: string | null;
  quantity: string;
  beforeStock: string;
  afterStock: string;
  reason: string | null;
  createdAt: string;
  product: InventoryMovementProduct;
  user: InventoryMovementUser;
}

export interface InventoryMovementListMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface InventoryMovementListResponse {
  data: InventoryMovement[];
  meta: InventoryMovementListMeta;
}

export interface InventoryMovementQueryParams {
  page?: number;
  per_page?: number;
  product_id?: string;
  movement_type?: InventoryMovementType;
  reference_type?: InventoryReferenceType;
  sort_order?: "asc" | "desc";
}