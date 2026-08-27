"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { SaleForm } from "@/features/sales/components/SaleForm";
import { useSale } from "@/features/sales/queries/use-sale";
import { useCustomers } from "@/features/customers/queries/use-customers";
import { useProducts } from "@/features/products/queries/use-products";
import { usePermissions } from "@/hooks/use-permissions";

type EditSalePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditSalePage({
  params,
}: EditSalePageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canUpdateSale = hasPermission("sales.update");

  const sale = useSale(id);

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

  if (
    sale.isLoading ||
    customers.isLoading ||
    products.isLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-56 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    sale.error ||
    customers.error ||
    products.error
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load sale editor.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(`/sales/${id}`)
          }
        >
          Back to Sale
        </Button>
      </div>
    );
  }

  if (!sale.data) {
    return null;
  }

  if (sale.data.status !== "PENDING") {
    router.replace(`/sales/${id}`);
    return null;
  }

  if (!canUpdateSale) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit this sale.
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
          Edit Sale
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update this sale before payment.
        </p>
      </div>

      <SaleForm
        sale={sale.data}
        customers={
          customers.data?.data ?? []
        }
        products={
          products.data?.data ?? []
        }
      />
    </div>
  );
}