"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PurchaseReturnPagination } from "@/features/purchase-returns/components/PurchaseReturnPagination";
import { PurchaseReturnTable } from "@/features/purchase-returns/components/PurchaseReturnTable";
import { PurchaseReturnToolbar } from "@/features/purchase-returns/components/PurchaseReturnToolbar";

import { usePurchaseReturns } from "@/features/purchase-returns/queries/use-purchase-returns";

import type { PurchaseReturnQueryParams } from "@/features/purchase-returns/types/purchase-return";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: PurchaseReturnQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "returnDate",
  sort_order: "desc",
};

export default function PurchaseReturnsPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();

  const canReadPurchases =
    hasPermission("purchases.read");

  const canCreatePurchase =
    hasPermission("purchases.create");

  const [params, setParams] =
    useState<PurchaseReturnQueryParams>(
      DEFAULT_PARAMS,
    );

  const purchaseReturns = usePurchaseReturns(
    params,
    canReadPurchases,
  );

  const purchaseReturnData =
    purchaseReturns.data?.data ?? [];

  const meta =
    purchaseReturns.data?.meta;

  if (!canReadPurchases) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view purchase returns.
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
            Purchase Returns
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage goods returned to suppliers.
          </p>
        </div>

        {canCreatePurchase && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push(
                "/purchase-returns/new",
              )
            }
          >
            Add Purchase Return
          </Button>
        )}
      </div>

      <PurchaseReturnToolbar
        params={params}
        onChange={setParams}
      />

      {purchaseReturns.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : purchaseReturns.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load purchase returns.
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
                ? "purchase return"
                : "purchase returns"}
            </p>
          </div>

          <PurchaseReturnTable
            purchaseReturns={
              purchaseReturnData
            }
            onView={(purchaseReturn) =>
              router.push(
                `/purchase-returns/${purchaseReturn.id}`,
              )
            }
          />

          {meta && (
            <PurchaseReturnPagination
              page={meta.page}
              totalPages={
                meta.total_pages
              }
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