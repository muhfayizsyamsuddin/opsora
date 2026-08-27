"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PurchasePagination } from "@/features/purchases/components/PurchasePagination";
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable";
import { PurchaseToolbar } from "@/features/purchases/components/PurchaseToolbar";

import { usePurchases } from "@/features/purchases/queries/use-purchases";
import { useSuppliers } from "@/features/suppliers/queries/use-suppliers";

import type { PurchaseQueryParams } from "@/features/purchases/types/purchase";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: PurchaseQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "purchaseDate",
  sort_order: "desc",
};

export default function PurchasesPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadPurchases = hasPermission("purchases.read");
  const canCreatePurchase = hasPermission("purchases.create");

  const [params, setParams] =
    useState<PurchaseQueryParams>(
      DEFAULT_PARAMS,
    );

  const purchases =
    usePurchases(params);

  const suppliers = useSuppliers({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  const purchaseData =
    purchases.data?.data ?? [];

  const meta =
    purchases.data?.meta;

  if (!canReadPurchases) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Purchases
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage supplier purchases and stock intake.
          </p>
        </div>

        {canCreatePurchase && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/purchases/new")
            }
          >
            Add Purchase
          </Button>
        )}
      </div>

      <PurchaseToolbar
        params={params}
        suppliers={
          suppliers.data?.data ?? []
        }
        onChange={setParams}
      />

      {purchases.isLoading ||
      suppliers.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : purchases.error ||
        suppliers.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load purchases.
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
                ? "purchase"
                : "purchases"}
            </p>
          </div>

          <PurchaseTable
            purchases={purchaseData}
            onView={(purchase) =>
              router.push(
                `/purchases/${purchase.id}`,
              )
            }
          />

          {meta && (
            <PurchasePagination
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