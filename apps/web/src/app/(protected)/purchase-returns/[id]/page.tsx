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

import { usePurchaseReturn } from "@/features/purchase-returns/queries/use-purchase-return";
import { useCompletePurchaseReturn } from "@/features/purchase-returns/mutations/use-complete-purchase-return";
import { useCancelPurchaseReturn } from "@/features/purchase-returns/mutations/use-cancel-purchase-return";
import { usePermissions } from "@/hooks/use-permissions";

type PurchaseReturnDetailPageProps = {
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

export default function PurchaseReturnDetailPage({
  params,
}: PurchaseReturnDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();

  const canRead = hasPermission("purchases.read");
  const canComplete = hasPermission(
    "purchases.complete",
  );
  const canCancel = hasPermission(
    "purchases.cancel",
  );

  const purchaseReturn = usePurchaseReturn(
    id,
    canRead,
  );

  const complete =
    useCompletePurchaseReturn();

  const cancel =
    useCancelPurchaseReturn();

  const [action, setAction] = useState<
    "complete" | "cancel" | null
  >(null);

  if (!canRead) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this purchase return.
        </p>
      </div>
    );
  }

  if (purchaseReturn.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    purchaseReturn.error ||
    !purchaseReturn.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load purchase return.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/purchase-returns")
          }
        >
          Back to Purchase Returns
        </Button>
      </div>
    );
  }

  const data = purchaseReturn.data;
  const isDraft = data.status === "DRAFT";

  const isPending =
    complete.isPending ||
    cancel.isPending;

  const handleConfirm = () => {
    if (action === "complete") {
      complete.mutate(data.id, {
        onSuccess: () =>
          setAction(null),
      });

      return;
    }

    if (action === "cancel") {
      cancel.mutate(data.id, {
        onSuccess: () =>
          setAction(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Purchase Returns
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Purchase Return Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review returned goods and lifecycle status.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push("/purchase-returns")
          }
        >
          Back to Purchase Returns
        </Button>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Supplier
            </p>

            <p className="mt-1 font-semibold">
              {data.purchase.supplier.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Return Date
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.returnDate)}
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

        <div className="mt-6 border-t pt-5">
          <p className="text-xs text-muted-foreground">
            Reason
          </p>

          <p className="mt-1 text-sm">
            {data.reason ?? "—"}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">
            Return Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products being returned to the supplier.
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
              Total Return Amount
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
                  Purchase Return Actions
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Completing this return will decrease inventory stock.
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
                      : "Cancel Return"}
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
                      : "Complete Return"}
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
                ? "Complete Purchase Return?"
                : "Cancel Purchase Return?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {action === "complete"
                ? "Completing this return will reduce inventory stock and cannot be completed again."
                : "Cancelling this draft return will prevent it from being completed."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isPending}
              onClick={handleConfirm}
            >
              {action === "complete"
                ? "Complete Return"
                : "Cancel Return"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}