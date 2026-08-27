"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import type {
  RoleQueryParams,
} from "@/features/roles/types/role";

type RoleToolbarProps = {
  params: RoleQueryParams;
  onChange: (
    params: RoleQueryParams,
  ) => void;
};

export function RoleToolbar({
  params,
  onChange,
}: RoleToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={params.search ?? ""}
          placeholder="Search roles..."
          className="h-10 rounded-xl pl-9"
          onChange={(event) => {
            onChange({
              ...params,
              page: 1,
              search:
                event.target.value ||
                undefined,
            });
          }}
        />
      </div>

      <select
        value={params.sort_by ?? "name"}
        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
        onChange={(event) => {
          onChange({
            ...params,
            page: 1,
            sort_by: event.target.value as
              | "name"
              | "createdAt",
          });
        }}
      >
        <option value="name">
          Name
        </option>

        <option value="createdAt">
          Created At
        </option>
      </select>

      <select
        value={params.sort_order ?? "asc"}
        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
        onChange={(event) => {
          onChange({
            ...params,
            page: 1,
            sort_order: event.target.value as
              | "asc"
              | "desc",
          });
        }}
      >
        <option value="asc">
          Ascending
        </option>

        <option value="desc">
          Descending
        </option>
      </select>
    </div>
  );
}