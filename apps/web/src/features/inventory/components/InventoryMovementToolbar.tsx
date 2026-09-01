"use client";

import type {
  InventoryMovementQueryParams,
  InventoryMovementType,
  InventoryReferenceType,
} from "@/features/inventory/types/inventory";

import type { Product } from "@/features/products/types/product";

type InventoryMovementToolbarProps = {
  params: InventoryMovementQueryParams;
  products: Product[];
  onChange: (
    params: InventoryMovementQueryParams,
  ) => void;
};

export function InventoryMovementToolbar({
  params,
  products,
  onChange,
}: InventoryMovementToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={params.product_id ?? ""}
          onChange={(event) =>
            onChange({
              ...params,
              page: 1,
              product_id:
                event.target.value || undefined,
            })
          }
          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">
            All products
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name} ({product.sku})
            </option>
          ))}
        </select>

        <select
          value={params.movement_type ?? ""}
          onChange={(event) =>
            onChange({
              ...params,
              page: 1,
              movement_type:
                (event.target.value || undefined) as
                  | InventoryMovementType
                  | undefined,
            })
          }
          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">
            All movement types
          </option>

          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <select
          value={params.reference_type ?? ""}
          onChange={(event) =>
            onChange({
              ...params,
              page: 1,
              reference_type:
                (event.target.value || undefined) as
                  | InventoryReferenceType
                  | undefined,
            })
          }
          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">
            All references
          </option>

          <option value="PURCHASE">
            Purchase
          </option>

          <option value="SALE">
            Sale
          </option>

          <option value="ADJUSTMENT">
            Adjustment
          </option>
          <option value="PURCHASE_RETURN">
            Purchase Return
          </option>

          <option value="SALE_RETURN">
            Sale Return
          </option>
        </select>
      </div>
    </div>
  );
}