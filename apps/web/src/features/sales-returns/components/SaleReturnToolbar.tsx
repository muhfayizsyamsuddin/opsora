"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  SaleReturnQueryParams,
  SaleReturnStatus,
} from "@/features/sales-returns/types/sale-return";

type SaleReturnToolbarProps = {
  params: SaleReturnQueryParams;
  onChange: (
    params: SaleReturnQueryParams,
  ) => void;
};

export function SaleReturnToolbar({
  params,
  onChange,
}: SaleReturnToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor="sale-return-search"
            className="text-sm font-medium"
          >
            Search customer
          </label>

          <Input
            id="sale-return-search"
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
            placeholder="Search customer..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sale-return-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="sale-return-status"
            value={params.status ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                status:
                  (event.target.value ||
                    undefined) as
                    | SaleReturnStatus
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
            htmlFor="sale-return-date-from"
            className="text-sm font-medium"
          >
            From date
          </label>

          <Input
            id="sale-return-date-from"
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
            htmlFor="sale-return-date-to"
            className="text-sm font-medium"
          >
            To date
          </label>

          <Input
            id="sale-return-date-to"
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