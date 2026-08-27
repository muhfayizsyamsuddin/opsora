"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type {
  UserQueryParams,
} from "@/features/users/types/user";

type UserToolbarProps = {
  params: UserQueryParams;
  onChange: (
    params: UserQueryParams,
  ) => void;
};

export function UserToolbar({
  params,
  onChange,
}: UserToolbarProps) {
  const updateParams = (
    updates: Partial<UserQueryParams>,
  ) => {
    onChange({
      ...params,
      ...updates,
      page: 1,
    });
  };

  const resetFilters = () => {
    onChange({
      page: 1,
      per_page: 20,
      sort_by: "createdAt",
      sort_order: "desc",
    });
  };

  const hasFilters =
    Boolean(params.search) ||
    Boolean(params.role_id) ||
    params.sort_by !== "createdAt" ||
    params.sort_order !== "desc";

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">
          Filters
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Search and filter users.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Search
          </label>

          <Input
            value={params.search ?? ""}
            onChange={(event) =>
              updateParams({
                search:
                  event.target.value ||
                  undefined,
              })
            }
            placeholder="Search name or email..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Sort By
          </label>

          <select
            value={
              params.sort_by ??
              "createdAt"
            }
            onChange={(event) =>
              updateParams({
                sort_by:
                  event.target.value as UserQueryParams["sort_by"],
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
          >
            <option value="createdAt">
              Created At
            </option>

            <option value="name">
              Name
            </option>

            <option value="email">
              Email
            </option>
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Order
          </label>

          <select
            value={
              params.sort_order ??
              "desc"
            }
            onChange={(event) =>
              updateParams({
                sort_order:
                  event.target.value as UserQueryParams["sort_order"],
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
          >
            <option value="desc">
              Descending
            </option>

            <option value="asc">
              Ascending
            </option>
          </select>
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl lg:w-auto"
            onClick={resetFilters}
          >
            Reset
          </Button>
        )}
      </div>
    </section>
  );
}