"use client";

import { PurchaseForm } from "@/features/purchases/components/PurchaseForm";
import { useProducts } from "@/features/products/queries/use-products";
import { useSuppliers } from "@/features/suppliers/queries/use-suppliers";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewPurchasePage() {
  const { hasPermission } = usePermissions();
  const canCreatePurchase = hasPermission("purchases.create");

  const suppliers = useSuppliers({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  const products = useProducts({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
    status: "ACTIVE",
  });

  if (!canCreatePurchase) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Purchases
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Purchase
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a purchase draft for a supplier.
        </p>
      </div>

      {suppliers.isLoading ||
      products.isLoading ? (
        <div className="space-y-6">
          <div className="h-52 animate-pulse rounded-2xl border bg-muted/30" />
          <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
          <div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
        </div>
      ) : suppliers.error ||
        products.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load purchase form.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Suppliers or products could not be loaded.
          </p>
        </div>
      ) : (
        <PurchaseForm
          suppliers={
            suppliers.data?.data ?? []
          }
          products={
            products.data?.data ?? []
          }
        />
      )}
    </div>
  );
}