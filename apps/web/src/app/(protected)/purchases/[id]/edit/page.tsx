"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PurchaseForm } from "@/features/purchases/components/PurchaseForm";
import { usePurchase } from "@/features/purchases/queries/use-purchase";
import { useSuppliers } from "@/features/suppliers/queries/use-suppliers";
import { useProducts } from "@/features/products/queries/use-products";
import { usePermissions } from "@/hooks/use-permissions";

type EditPurchasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditPurchasePage({
  params,
}: EditPurchasePageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const { hasPermission } = usePermissions();
  const canReadPurchase = hasPermission("purchases.read");
  const canUpdatePurchase = hasPermission("purchases.update");
  const canReadSuppliers = hasPermission("suppliers.read");
  const canReadProducts = hasPermission("products.read");

  const purchase = usePurchase(
    id,
    canReadPurchase && canUpdatePurchase,
  );

  const suppliers = useSuppliers(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canReadPurchase &&
      canUpdatePurchase &&
      canReadSuppliers,
  );

  const products = useProducts(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
      status: "ACTIVE",
    },
    canReadPurchase &&
      canUpdatePurchase &&
      canReadProducts,
  );

  if (
    !canReadPurchase ||
    !canUpdatePurchase
  ) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit purchases.
        </p>
      </div>
    );
  }

  if (!canReadSuppliers || !canReadProducts) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view suppliers or products required to edit purchases.
        </p>
      </div>
    );
  }

  if (
    purchase.isLoading ||
    suppliers.isLoading ||
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
    purchase.error ||
    suppliers.error ||
    products.error
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load purchase editor.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(
              `/purchases/${id}`,
            )
          }
        >
          Back to Purchase
        </Button>
      </div>
    );
  }

  if (!purchase.data) {
    return null;
  }

  if (purchase.data.status !== "DRAFT") {
    router.replace(
      `/purchases/${purchase.data.id}`,
    );
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Purchases
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Purchase
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update this draft purchase before completing it.
        </p>
      </div>

      <PurchaseForm
        purchase={purchase.data}
        suppliers={
          suppliers.data?.data ?? []
        }
        products={
          products.data?.data ?? []
        }
      />
    </div>
  );
}