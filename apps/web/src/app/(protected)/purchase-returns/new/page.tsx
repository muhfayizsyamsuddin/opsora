"use client";

import { PurchaseReturnForm } from "@/features/purchase-returns/components/PurchaseReturnForm";
import { usePurchases } from "@/features/purchases/queries/use-purchases";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewPurchaseReturnPage() {
  const { hasPermission } = usePermissions();

  const canCreatePurchaseReturn =
    hasPermission("purchases.create");

  const canReadPurchases =
    hasPermission("purchases.read");

  const purchases = usePurchases(
    {
      page: 1,
      per_page: 100,
      sort_by: "purchaseDate",
      sort_order: "desc",
    },
    canCreatePurchaseReturn &&
      canReadPurchases,
  );

  if (!canCreatePurchaseReturn) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create purchase returns.
        </p>
      </div>
    );
  }

  if (!canReadPurchases) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view purchases required to create a purchase return.
        </p>
      </div>
    );
  }

  if (purchases.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-52 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (purchases.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load purchase return form.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Purchases could not be loaded.
        </p>
      </div>
    );
  }

  const completedPurchases =
    purchases.data?.data.filter(
      (purchase) =>
        purchase.status === "COMPLETED",
    ) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Purchase Returns
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Purchase Return
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a return draft from a completed purchase.
        </p>
      </div>

      {completedPurchases.length === 0 ? (
        <div className="rounded-2xl border bg-card p-6">
          <p className="font-medium">
            No completed purchases available.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Complete a purchase before creating a purchase return.
          </p>
        </div>
      ) : (
        <PurchaseReturnForm
          purchases={completedPurchases}
        />
      )}
    </div>
  );
}