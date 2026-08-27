"use client";

import type { InventoryStock } from "@/features/inventory/types/inventory";

type InventoryStockTableProps = {
  stock: InventoryStock[];
};

function getStockState(item: InventoryStock) {
  const stock = Number(item.stock);
  const minimumStock = Number(
    item.minimumStock,
  );

  if (stock === 0) {
    return {
      label: "Out of stock",
      className:
        "border-destructive/20 bg-destructive/10 text-destructive",
    };
  }

  if (stock <= minimumStock) {
    return {
      label: "Low stock",
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: "In stock",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }

export function InventoryStockTable({
  stock,
}: InventoryStockTableProps) {
  if (stock.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/50">
            <span className="text-lg">∅</span>
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No inventory records found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your search.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Product
              </th>

              <th className="px-5 py-4">
                SKU
              </th>

              <th className="px-5 py-4">
                Stock
              </th>

              <th className="px-5 py-4">
                Minimum
              </th>

              <th className="px-5 py-4">
                Unit
              </th>

              <th className="px-5 py-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {stock.map((item) => {
              const stockState =
                getStockState(item);

              return (
                <tr
                  key={item.id}
                  className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/30"
                >
                  <td className="px-5 py-4 font-medium">
                    {item.name}
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold">
                      {item.stock}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {item.minimumStock}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {item.unit}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${stockState.className}`}
                    >
                      {stockState.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}