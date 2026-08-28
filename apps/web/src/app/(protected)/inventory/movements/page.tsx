"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { InventoryMovementTable } from "@/features/inventory/components/InventoryMovementTable";
import { InventoryMovementToolbar } from "@/features/inventory/components/InventoryMovementToolbar";
import { InventoryPagination } from "@/features/inventory/components/InventoryPagination";

import { useInventoryMovements } from "@/features/inventory/queries/use-inventory-movements";
import { useProducts } from "@/features/products/queries/use-products";

import type { InventoryMovementQueryParams } from "@/features/inventory/types/inventory";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: InventoryMovementQueryParams = {
  page: 1,
  per_page: 20,
  sort_order: "desc",
};

export default function InventoryMovementsPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadMovements = hasPermission("inventory-movements.read");
  const canReadProducts = hasPermission("products.read");

  const [params, setParams] =
    useState<InventoryMovementQueryParams>(
      DEFAULT_PARAMS,
    );

  const movements = useInventoryMovements(params);

  const products = useProducts(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canReadProducts,
  );

  if (!canReadMovements) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view inventory movements.
        </p>
      </div>
    );
  }

  const movementData =
    movements.data?.data ?? [];

  const meta =
    movements.data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Inventory
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Movement History
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review stock movements and inventory changes.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push("/inventory")
          }
        >
          Current Stock
        </Button>
      </div>

      <InventoryMovementToolbar
        params={params}
        products={
          canReadProducts
            ? products.data?.data ?? []
            : []
        }
        onChange={setParams}
      />

      {movements.isLoading ||
      (canReadProducts &&
        products.isLoading) ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : movements.error ||
      (canReadProducts &&
        products.error) ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load inventory movements.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0} movements
            </p>
          </div>

          <InventoryMovementTable
            movements={movementData}
            onView={(movement) =>
              router.push(
                `/inventory/movements/${movement.id}`,
              )
            }
          />

          {meta && (
            <InventoryPagination
              page={meta.page}
              totalPages={meta.total_pages}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(page) =>
                setParams((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          )}
        </>
      )}
    </div>
  );
}