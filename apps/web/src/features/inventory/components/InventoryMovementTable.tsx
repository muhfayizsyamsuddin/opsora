"use client";

import type { InventoryMovement } from "@/features/inventory/types/inventory";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type InventoryMovementTableProps = {
  movements: InventoryMovement[];
  onView: (
    movement: InventoryMovement,
  ) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InventoryMovementTable({
  movements,
  onView,
}: InventoryMovementTableProps) {
  if (movements.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/50">
            ∅
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No movements found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your filters.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Product
              </th>

              <th className="px-5 py-4">
                Type
              </th>

              <th className="px-5 py-4">
                Reference
              </th>

              <th className="px-5 py-4">
                Quantity
              </th>

              <th className="px-5 py-4">
                Stock Change
              </th>

              <th className="px-5 py-4">
                User
              </th>

              <th className="px-5 py-4">
                Date
              </th>
              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => {
              const isIn =
                movement.movementType === "IN";

              return (
                <tr
                  key={movement.id}
                  className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {movement.product.name}
                    </p>

                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {movement.product.sku}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                        isIn
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {movement.movementType}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {movement.referenceType}
                    </p>

                    {movement.reason && (
                      <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                        {movement.reason}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {isIn ? "+" : "-"}
                    {movement.quantity}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-muted-foreground">
                      {movement.beforeStock}
                      {" → "}
                      {movement.afterStock}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {movement.user.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {movement.user.roleRef.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(
                      movement.createdAt,
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        aria-label="View movement"
                        onClick={() =>
                          onView(movement)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
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