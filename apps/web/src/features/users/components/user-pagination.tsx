"use client";

import { Button } from "@/components/ui/button";

type UserPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (
    page: number,
  ) => void;
};

export function UserPagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
}: UserPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start =
    (page - 1) * perPage + 1;

  const end = Math.min(
    page * perPage,
    total,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total}
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

        <div className="min-w-20 text-center text-sm font-medium">
          Page {page} of {totalPages}
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