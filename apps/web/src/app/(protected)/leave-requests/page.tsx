"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useEmployees } from "@/features/employees/queries/use-employees";

import { LeavePagination } from "@/features/leaves/components/LeavePagination";
import { LeaveTable } from "@/features/leaves/components/LeaveTable";
import { LeaveToolbar } from "@/features/leaves/components/LeaveToolbar";
import { useLeaves } from "@/features/leaves/queries/use-leaves";

import type {
  LeaveQueryParams,
} from "@/features/leaves/types/leave";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: LeaveQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function LeavesPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadLeaves = hasPermission("leaves.read");
  const canCreateLeave = hasPermission("leaves.create");
  const canUpdateLeave = hasPermission("leaves.update");

  const [params, setParams] =
    useState<LeaveQueryParams>(
      DEFAULT_PARAMS,
    );

  const leaves = useLeaves(params);

  const employees = useEmployees({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  const data =
    leaves.data?.data ?? [];

  const meta =
    leaves.data?.meta;

  if (!canReadLeaves) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view leave requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Leave Requests
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage employee leave requests and their approval status.
          </p>
        </div>

        {canCreateLeave && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/leave-requests/new")
            }
          >
            Create Leave
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <LeaveToolbar
        params={params}
        employees={
          employees.data?.data ?? []
        }
        onChange={setParams}
      />

      {/* Content */}
      {leaves.isLoading ||
      employees.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : leaves.error ||
        employees.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load leave requests.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => {
              leaves.refetch();
              employees.refetch();
            }}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "leave request"
                : "leave requests"}
            </p>
          </div>

          <LeaveTable
            leaves={data}
            canUpdate={canUpdateLeave}
            onView={(leave) =>
              router.push(
                `/leave-requests/${leave.id}`,
              )
            }
            onEdit={(leave) =>
              router.push(
                `/leave-requests/${leave.id}/edit`,
              )
            }
          />

          {meta && (
            <LeavePagination
              page={meta.page}
              totalPages={
                meta.total_pages
              }
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