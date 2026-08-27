"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePurchase } from "@/features/purchases/queries/use-purchase";
import { useCompletePurchase } from "@/features/purchases/mutations/use-complete-purchase";
import { useCancelPurchase } from "@/features/purchases/mutations/use-cancel-purchase";
import { usePermissions } from "@/hooks/use-permissions";

type PurchaseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "CANCELLED":
      return "border-destructive/20 bg-destructive/10 text-destructive";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
}

export default function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canRead = hasPermission("purchases.read");
  const canUpdate = hasPermission("purchases.update");
  const canComplete = hasPermission("purchases.complete");
  const canCancel = hasPermission("purchases.cancel");

  const purchase = usePurchase(id);
  const complete = useCompletePurchase();
  const cancel = useCancelPurchase();
  const [action, setAction] = useState<
    "complete" | "cancel" | null
  >(null);

  if (purchase.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (purchase.error || !purchase.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load purchase.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/purchases")
          }
        >
          Back to Purchases
        </Button>
      </div>
    );
  }

  const data = purchase.data;
  const isDraft = data.status === "DRAFT";
  const isPending =
    complete.isPending ||
    cancel.isPending;

  if (!canRead) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Purchases
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Purchase Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review purchase information and lifecycle status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/purchases")
            }
          >
            Back to Purchases
          </Button>

          {isDraft && canUpdate && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={isPending}
              onClick={() =>
                router.push(
                  `/purchases/${data.id}/edit`,
                )
              }
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Supplier
            </p>

            <p className="mt-1 font-semibold">
              {data.supplier.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Purchase Date
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(
                data.purchaseDate,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created By
            </p>

            <p className="mt-1 font-semibold">
              {data.user.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                data.status,
              )}`}
            >
              {data.status}
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">
            Purchase Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products included in this purchase.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  Quantity
                </th>

                <th className="px-5 py-4">
                  Unit Price
                </th>

                <th className="px-5 py-4 text-right">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {item.product.name}
                    </p>

                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {item.product.sku}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {item.quantity}{" "}
                    {item.product.unit}
                  </td>

                  <td className="px-5 py-4">
                    {formatCurrency(
                      item.unitPrice,
                    )}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold">
                    {formatCurrency(
                      item.subtotal,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end border-t px-5 py-5 sm:px-6">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total Amount
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatCurrency(
                data.totalAmount,
              )}
            </p>
          </div>
        </div>
      </section>

      {isDraft &&
        (canComplete || canCancel) && (
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">
                  Purchase Actions
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Completing this purchase will increase inventory stock.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {canCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl text-destructive hover:text-destructive"
                    disabled={isPending}
                    onClick={() =>
                      setAction("cancel")
                    }
                  >
                    {cancel.isPending
                      ? "Cancelling..."
                      : "Cancel Purchase"}
                  </Button>
                )}

                {canComplete && (
                  <Button
                    type="button"
                    className="rounded-xl"
                    disabled={isPending}
                    onClick={() =>
                      setAction("complete")
                    }
                  >
                    {complete.isPending
                      ? "Completing..."
                      : "Complete Purchase"}
                  </Button>
                )}
              </div>
            </div>
          </section>
      )}
      <AlertDialog
        open={action !== null}
        onOpenChange={(open) => {
            if (!open) {
            setAction(null);
            }
        }}
        >
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                {action === "complete"
                ? "Complete this purchase?"
                : "Cancel this purchase?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
                {action === "complete"
                ? "Completing this purchase will increase inventory stock and create a PURCHASE inventory movement."
                : "Cancelling this purchase will mark it as CANCELLED. Inventory stock will not be changed."}
            </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
            <AlertDialogCancel
                disabled={complete.isPending || cancel.isPending}
            >
                Back
            </AlertDialogCancel>

            <AlertDialogAction
                disabled={complete.isPending || cancel.isPending}
                className={
                action === "cancel"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : ""
                }
                onClick={() => {
                if (action === "complete") {
                    complete.mutate(data.id, {
                    onSuccess: () => {
                        setAction(null);
                    },
                    });

                    return;
                }

                cancel.mutate(data.id, {
                    onSuccess: () => {
                    setAction(null);
                    },
                });
                }}
            >
                {action === "complete"
                ? complete.isPending
                    ? "Completing..."
                    : "Complete Purchase"
                : cancel.isPending
                    ? "Cancelling..."
                    : "Cancel Purchase"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}