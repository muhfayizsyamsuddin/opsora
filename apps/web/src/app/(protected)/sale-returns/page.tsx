"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { SaleReturnPagination } from "@/features/sales-returns/components/SaleReturnPagination";
import { SaleReturnTable } from "@/features/sales-returns/components/SaleReturnTable";
import { SaleReturnToolbar } from "@/features/sales-returns/components/SaleReturnToolbar";

import { useSaleReturns } from "@/features/sales-returns/queries/use-sale-returns";

import type { SaleReturnQueryParams } from "@/features/sales-returns/types/sale-return";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: SaleReturnQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "returnDate",
  sort_order: "desc",
};

export default function SaleReturnsPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const canReadSales =
    hasPermission("sales.read");

  const canCreateSale =
    hasPermission("sales.create");

  const [params, setParams] =
    useState<SaleReturnQueryParams>(
      DEFAULT_PARAMS,
    );

  const saleReturns = useSaleReturns(
    params,
    canReadSales,
  );

  const saleReturnData =
    saleReturns.data?.data ?? [];

  const meta = saleReturns.data?.meta;

  if (!canReadSales) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view
          sale returns.
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
            Sale Returns
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage customer returns and returned
            inventory.
          </p>
        </div>

        {canCreateSale && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push(
                "/sale-returns/new",
              )
            }
          >
            Add Sale Return
          </Button>
        )}
      </div>

      <SaleReturnToolbar
        params={params}
        onChange={setParams}
      />

      {saleReturns.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : saleReturns.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load sale returns.
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
                ? "sale return"
                : "sale returns"}
            </p>
          </div>

          <SaleReturnTable
            saleReturns={saleReturnData}
            onView={(saleReturn) =>
              router.push(
                `/sale-returns/${saleReturn.id}`,
              )
            }
          />

          {meta && (
            <SaleReturnPagination
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