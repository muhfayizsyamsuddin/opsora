"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Customer } from "@/features/customers/types/customer";
import type { SaleQueryParams } from "@/features/sales/types/sale";

type SaleToolbarProps = {
  params: SaleQueryParams;
  customers: Customer[];
  onChange: (params: SaleQueryParams) => void;
};

export function SaleToolbar({
  params,
  customers,
  onChange,
}: SaleToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor="sale-search"
            className="text-sm font-medium"
          >
            Search customer
          </label>

          <Input
            id="sale-search"
            value={params.search ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                search:
                  event.target.value || undefined,
              })
            }
            placeholder="Search customer..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sale-customer"
            className="text-sm font-medium"
          >
            Customer
          </label>

          <select
            id="sale-customer"
            value={params.customer_id ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                customer_id:
                  event.target.value || undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All customers
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sale-date-from"
            className="text-sm font-medium"
          >
            From date
          </label>

          <Input
            id="sale-date-from"
            type="date"
            value={params.date_from ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                date_from:
                  event.target.value || undefined,
              })
            }
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sale-date-to"
            className="text-sm font-medium"
          >
            To date
          </label>

          <Input
            id="sale-date-to"
            type="date"
            value={params.date_to ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                date_to:
                  event.target.value || undefined,
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
              sort_by: "saleDate",
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