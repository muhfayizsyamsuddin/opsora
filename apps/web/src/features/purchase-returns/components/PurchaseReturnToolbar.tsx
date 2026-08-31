"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { PurchaseReturnQueryParams } from "@/features/purchase-returns/types/purchase-return";

type PurchaseReturnToolbarProps = {
  params: PurchaseReturnQueryParams;
  onChange: (
    params: PurchaseReturnQueryParams,
  ) => void;
};

export function PurchaseReturnToolbar({
  params,
  onChange,
}: PurchaseReturnToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor="purchase-return-search"
            className="text-sm font-medium"
          >
            Search supplier
          </label>

          <Input
            id="purchase-return-search"
            value={params.search ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                search:
                  event.target.value ||
                  undefined,
              })
            }
            placeholder="Search supplier..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="purchase-return-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="purchase-return-status"
            value={params.status ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                status:
                  (event.target.value ||
                    undefined) as
                    | "DRAFT"
                    | "COMPLETED"
                    | "CANCELLED"
                    | undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All statuses
            </option>
            <option value="DRAFT">
              Draft
            </option>
            <option value="COMPLETED">
              Completed
            </option>
            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="purchase-return-date-from"
            className="text-sm font-medium"
          >
            From date
          </label>

          <Input
            id="purchase-return-date-from"
            type="date"
            value={params.date_from ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                date_from:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="purchase-return-date-to"
            className="text-sm font-medium"
          >
            To date
          </label>

          <Input
            id="purchase-return-date-to"
            type="date"
            value={params.date_to ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                date_to:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 rounded-xl"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          onClick={() =>
            onChange({
              page: 1,
              per_page: 20,
              sort_by: "returnDate",
              sort_order: "desc",
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
}