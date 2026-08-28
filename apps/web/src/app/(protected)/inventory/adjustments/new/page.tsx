"use client";

import { InventoryAdjustmentForm } from "@/features/inventory/components/InventoryAdjustmentForm";
import { useProducts } from "@/features/products/queries/use-products";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewInventoryAdjustmentPage() {
  const products = useProducts({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
    status: "ACTIVE",
  });
  const { hasPermission } = usePermissions();
  const canAdjustInventory = hasPermission("inventory-movements.adjust");

  if (!canAdjustInventory) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to adjust inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Inventory
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Adjust Stock
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Record a manual stock adjustment.
        </p>
      </div>

      {products.isLoading ? (
        <div className="h-96 animate-pulse rounded-2xl border bg-muted/30" />
      ) : products.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load products.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <InventoryAdjustmentForm
          products={
            products.data?.data ?? []
          }
        />
      )}
    </div>
  );
}