"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  Package,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useInventoryMovement } from "@/features/inventory/queries/use-inventory-movement";
import { usePermissions } from "@/hooks/use-permissions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

export default function InventoryMovementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadMovement = hasPermission("inventory-movements.read");
  
  const movement =
    useInventoryMovement(id);

  if (movement.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    movement.error ||
    !movement.data
  ) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push(
              "/inventory/movements",
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movements
        </Button>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load inventory movement.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              movement.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = movement.data;

  const isIn =
    data.movementType === "IN";
    
  if (!canReadMovement) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view inventory movements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 mb-3 rounded-xl"
          onClick={() =>
            router.push(
              "/inventory/movements",
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movements
        </Button>

        <p className="text-sm font-medium text-muted-foreground">
          Inventory
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Movement Details
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review the inventory transaction and stock change.
        </p>
      </div>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Movement Information
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
          <div>
            <p className="text-xs text-muted-foreground">
              Movement Type
            </p>

            <span
              className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                isIn
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-destructive/20 bg-destructive/10 text-destructive"
              }`}
            >
              {data.movementType}
            </span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Reference Type
            </p>

            <p className="mt-1 font-medium">
              {data.referenceType}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Reference ID
            </p>

            <p className="mt-1 break-all font-medium">
              {data.referenceId ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Quantity
            </p>

            <p className="mt-1 font-semibold">
              {isIn ? "+" : "-"}
              {data.quantity}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Before Stock
            </p>

            <p className="mt-1 font-medium">
              {data.beforeStock}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              After Stock
            </p>

            <p className="mt-1 font-medium">
              {data.afterStock}
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground">
              Reason
            </p>

            <p className="mt-1 text-sm font-medium">
              {data.reason ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Product
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Product Name
              </p>

              <p className="mt-1 font-semibold">
                {data.product.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Boxes className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                SKU
              </p>

              <p className="mt-1 font-medium">
                {data.product.sku}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Performed By
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                User
              </p>

              <p className="mt-1 font-semibold">
                {data.user.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {data.user.email}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Role
            </p>

            <p className="mt-1 font-medium">
              {data.user.roleRef.name}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(
                  data.createdAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}