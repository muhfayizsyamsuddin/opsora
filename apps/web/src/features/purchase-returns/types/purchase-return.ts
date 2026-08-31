export type PurchaseReturnStatus =
  | "DRAFT"
  | "COMPLETED"
  | "CANCELLED";

export type PurchaseReturnItem = {
  id: string;
  purchaseReturnId: string;
  purchaseItemId: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  createdAt: string;

  purchaseItem: {
    id: string;
    purchaseId: string;
    productId: string;
    quantity: string;
    unitPrice: string;
    subtotal: string;
    createdAt: string;
  };

  product: {
    id: string;
    name: string;
    sku: string;
    stock: string;
    unit: string;
  };
};

export type PurchaseReturn = {
  id: string;
  purchaseId: string;
  userId: string;
  returnDate: string;
  reason: string | null;
  status: PurchaseReturnStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;

  purchase: {
    id: string;
    supplierId: string;
    userId: string;
    purchaseDate: string;
    totalAmount: string;
    status: "DRAFT" | "COMPLETED" | "CANCELLED";

    supplier: {
      id: string;
      name: string;
    };
  };

  user: {
    id: string;
    name: string;
    email: string;
  };

  items: PurchaseReturnItem[];
};

export type PurchaseReturnListResponse = {
  data: PurchaseReturn[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PurchaseReturnQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: PurchaseReturnStatus;
  purchase_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?:
    | "returnDate"
    | "createdAt"
    | "totalAmount";
  sort_order?: "asc" | "desc";
};

export type CreatePurchaseReturnInput = {
  purchaseId: string;
  returnDate: string;
  reason?: string;
  items: {
    purchaseItemId: string;
    quantity: number;
  }[];
};