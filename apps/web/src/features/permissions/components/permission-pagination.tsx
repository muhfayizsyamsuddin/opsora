"use client";

import { Button } from "@/components/ui/button";

type PermissionPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function PermissionPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PermissionPaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        {total}{" "}
        {total === 1
          ? "permission"
          : "permissions"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total}{" "}
        {total === 1
          ? "permission"
          : "permissions"}{" "}
        · Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
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

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={
            page >= totalPages
          }
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