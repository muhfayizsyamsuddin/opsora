"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InventoryPagination } from "@/features/inventory/components/InventoryPagination";
import { InventoryStockTable } from "@/features/inventory/components/InventoryStockTable";
import { InventoryToolbar } from "@/features/inventory/components/InventoryToolbar";

import { useInventoryStock } from "@/features/inventory/queries/use-inventory-stock";

import type { InventoryStockQueryParams } from "@/features/inventory/types/inventory";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: InventoryStockQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "name",
  sort_order: "asc",
};

export default function InventoryPage() {
  const router = useRouter();
  const [params, setParams] =
  useState<InventoryStockQueryParams>(
    DEFAULT_PARAMS,
  );

  const { hasPermission } = usePermissions();
  const canReadInventory = hasPermission("inventory-movements.read");
  const canAdjustInventory = hasPermission("inventory-movements.adjust");

  const inventory = useInventoryStock(params);
  if (!canReadInventory) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view inventory.
        </p>
      </div>
    );
  }

  const stock = inventory.data?.data ?? [];

  const meta = inventory.data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor current stock levels across active products.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/inventory/movements")
            }
          >
            Movement History
          </Button>
          {canAdjustInventory && (
            <Button
              type="button"
              className="rounded-xl"
              onClick={() =>
                router.push(
                  "/inventory/adjustments/new",
                )
              }
            >
              Adjust Stock
            </Button>
          )}
        </div>
      </div>

      <InventoryToolbar
        params={params}
        onChange={setParams}
      />

      {inventory.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : inventory.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load inventory.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "product"
                : "products"}
            </p>
          </div>

          <InventoryStockTable
            stock={stock}
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