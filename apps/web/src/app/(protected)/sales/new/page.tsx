"use client";

import { SaleForm } from "@/features/sales/components/SaleForm";
import { useCustomers } from "@/features/customers/queries/use-customers";
import { useProducts } from "@/features/products/queries/use-products";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewSalePage() {
  const { hasPermission } = usePermissions();
  const canCreateSale = hasPermission("sales.create");

  const customers = useCustomers({
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

  if (!canCreateSale) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create sales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Sales
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Sale
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a pending sale transaction.
        </p>
      </div>

      {customers.isLoading ||
      products.isLoading ? (
        <div className="space-y-6">
          <div className="h-52 animate-pulse rounded-2xl border bg-muted/30" />
          <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
          <div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
        </div>
      ) : customers.error ||
        products.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load sale form.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Customers or products could not be loaded.
          </p>
        </div>
      ) : (
        <SaleForm
          customers={
            customers.data?.data ?? []
          }
          products={
            products.data?.data ?? []
          }
        />
      )}
    </div>
  );
}