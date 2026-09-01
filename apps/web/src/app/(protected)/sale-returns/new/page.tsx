"use client";

import { SaleReturnForm } from "@/features/sales-returns/components/SaleReturnForm";
import { useSales } from "@/features/sales/queries/use-sales";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewSaleReturnPage() {
  const { hasPermission } =
    usePermissions();

  const canCreateSaleReturn =
    hasPermission("sales.create");

  const canReadSales =
    hasPermission("sales.read");

  const sales = useSales(
    {
      page: 1,
      per_page: 100,
      sort_by: "saleDate",
      sort_order: "desc",
    },
    canCreateSaleReturn &&
      canReadSales,
  );

  const completedSales =
    sales.data?.data.filter(
      (sale) =>
        sale.status === "COMPLETED",
    ) ?? [];

  if (!canCreateSaleReturn) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to
          create sale returns.
        </p>
      </div>
    );
  }

  if (!canReadSales) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to
          view sales required to create a
          sale return.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Sale Returns
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Sale Return
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a return draft from a
          completed sale.
        </p>
      </div>

      {sales.isLoading ? (
        <div className="space-y-6">
          <div className="h-52 animate-pulse rounded-2xl border bg-muted/30" />
          <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
          <div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
        </div>
      ) : sales.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load sale return
            form.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : completedSales.length ===
        0 ? (
        <div className="rounded-2xl border bg-card p-6">
          <p className="font-medium">
            No completed sales available.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Complete a sale before
            creating a sale return.
          </p>
        </div>
      ) : (
        <SaleReturnForm
          sales={completedSales}
        />
      )}
    </div>
  );
}