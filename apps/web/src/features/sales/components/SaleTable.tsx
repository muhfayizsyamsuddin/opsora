"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Sale } from "@/features/sales/types/sale";

type SaleTableProps = {
  sales: Sale[];
  onView: (sale: Sale) => void;
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
  }).format(new Date(value));
}

function getStatusStyle(status: Sale["status"]) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "CANCELLED":
      return "border-destructive/20 bg-destructive/10 text-destructive";

    case "PENDING":
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
}

export function SaleTable({
  sales,
  onView,
}: SaleTableProps) {
  if (sales.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/50">
            ∅
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No sales found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your filters or create a new sale.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Customer
              </th>

              <th className="px-5 py-4">
                Date
              </th>

              <th className="px-5 py-4">
                Items
              </th>

              <th className="px-5 py-4">
                Total
              </th>

              <th className="px-5 py-4">
                Payment
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {sale.customer?.name ??
                      "Walk-in Customer"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {sale.user.name}
                  </p>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(sale.saleDate)}
                </td>

                <td className="px-5 py-4">
                  <span className="font-medium">
                    {sale.items.length}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    item
                    {sale.items.length === 1
                      ? ""
                      : "s"}
                  </span>
                </td>

                <td className="px-5 py-4 font-semibold">
                  {formatCurrency(
                    sale.totalAmount,
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="text-muted-foreground">
                    {sale.paymentMethod}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                      sale.status,
                    )}`}
                  >
                    {sale.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label={`View sale ${sale.id}`}
                      onClick={() =>
                        onView(sale)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}