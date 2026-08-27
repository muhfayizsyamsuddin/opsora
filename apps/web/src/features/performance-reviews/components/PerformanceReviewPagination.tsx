"use client";

import { Button } from "@/components/ui/button";

type PerformanceReviewPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
};

export function PerformanceReviewPagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
}: PerformanceReviewPaginationProps) {
  const start =
    total === 0
      ? 0
      : (page - 1) * perPage + 1;

  const end = Math.min(
    page * perPage,
    total,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {total} reviews
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </Button>

        <div className="flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-medium">
          {page}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
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