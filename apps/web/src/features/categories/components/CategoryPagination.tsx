"use client";

import { Button } from "@/components/ui/button";

type CategoryPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
};

export function CategoryPagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
}: CategoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start =
    total === 0
      ? 0
      : (page - 1) * perPage + 1;

  const end = Math.min(
    page * perPage,
    total,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {total}
        </span>{" "}
        categories
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </Button>

        <div className="rounded-xl border px-3 py-2 text-sm font-medium">
          {page} / {totalPages}
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}