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

import { useSale } from "@/features/sales/queries/use-sale";
import { usePaySale } from "@/features/sales/mutations/use-pay-sale";
import { useCancelSale } from "@/features/sales/mutations/use-cancel-sale";
import { usePermissions } from "@/hooks/use-permissions";

type SaleDetailPageProps = {
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

function getStatusClass(
  status: string,
) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "CANCELLED":
      return "border-destructive/20 bg-destructive/10 text-destructive";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
}

export default function SaleDetailPage({
  params,
}: SaleDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const sale = useSale(id);
  const pay = usePaySale();
  const cancel = useCancelSale();

  const { hasPermission } = usePermissions();
  const canRead = hasPermission("sales.read");
  const canUpdate = hasPermission("sales.update");
  const canPay = hasPermission("sales.pay");
  const canCancel = hasPermission("sales.cancel");

  const [action, setAction] = useState<
    "pay" | "cancel" | null
  >(null);

  if (sale.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (sale.error || !sale.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load sale.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/sales")
          }
        >
          Back to Sales
        </Button>
      </div>
    );
  }

  const data = sale.data;

  const isPending =
    data.status === "PENDING";

  const isActionPending =
    pay.isPending ||
    cancel.isPending;
  
  if (!canRead) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this sale.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Sales
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Sale Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review sale information and transaction status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/sales")
            }
          >
            Back to Sales
          </Button>

          {data.status === "COMPLETED" &&
            canRead && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() =>
                  router.push(
                    `/sales/${data.id}/invoice`,
                  )
                }
              >
                Invoice
              </Button>
            )
          }

          {isPending && canUpdate && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={isActionPending}
              onClick={() =>
                router.push(
                  `/sales/${data.id}/edit`,
                )
              }
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <div>
            <p className="text-xs text-muted-foreground">
              Customer
            </p>

            <p className="mt-1 font-semibold">
              {data.customer?.name ??
                "Walk-in Customer"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Sale Date
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.saleDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Payment Method
            </p>

            <p className="mt-1 font-semibold">
              {data.paymentMethod}
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
            Sale Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products included in this sale.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
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

                <th className="px-5 py-4">
                  Discount
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

                  <td className="px-5 py-4">
                    {formatCurrency(
                      item.discount,
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

        <div className="border-t px-5 py-5 sm:px-6">
          <div className="ml-auto max-w-sm space-y-2">
            <SummaryRow
              label="Subtotal"
              value={formatCurrency(
                data.subtotal,
              )}
            />

            <SummaryRow
              label="Sale Discount"
              value={formatCurrency(
                data.discount,
              )}
            />

            <div className="flex items-center justify-between border-t pt-3">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-semibold">
                {formatCurrency(
                  data.totalAmount,
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {isPending &&
      (canPay || canCancel) && (
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                Sale Actions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Paying this sale will reduce inventory stock.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl text-destructive hover:text-destructive"
                  disabled={isActionPending}
                  onClick={() =>
                    setAction("cancel")
                  } 
                >
                  {cancel.isPending
                    ? "Cancelling..."
                    : "Cancel Sale"}
                </Button>
              )}

              {canPay && (
                <Button
                  type="button"
                  className="rounded-xl"
                  disabled={isActionPending}
                  onClick={() =>
                    setAction("pay")
                  }
                >
                  {pay.isPending
                    ? "Paying..."
                    : "Pay Sale"}
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
              {action === "pay"
                ? "Pay this sale?"
                : "Cancel this sale?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {action === "pay"
                ? "Paying this sale will mark it as COMPLETED and reduce inventory stock."
                : "Cancelling this sale will mark it as CANCELLED. Inventory stock will not be changed."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActionPending}
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isActionPending}
              className={
                action === "cancel"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={() => {
                if (action === "pay") {
                  pay.mutate(data.id, {
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
              {action === "pay"
                ? pay.isPending
                  ? "Paying..."
                  : "Pay Sale"
                : cancel.isPending
                  ? "Cancelling..."
                  : "Cancel Sale"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}