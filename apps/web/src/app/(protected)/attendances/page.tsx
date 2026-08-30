"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AttendancePagination } from "@/features/attendances/components/AttendancePagination";
import { AttendanceTable } from "@/features/attendances/components/AttendanceTable";
import { AttendanceToolbar } from "@/features/attendances/components/AttendanceToolbar";

import { useAttendances } from "@/features/attendances/queries/use-attendances";

import { useEmployees } from "@/features/employees/queries/use-employees";

import type {
  AttendanceQueryParams,
} from "@/features/attendances/types/attendance";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: AttendanceQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "checkIn",
  sort_order: "desc",
};

export default function AttendancesPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadAttendances = hasPermission("attendances.read");
  const canCreateAttendance = hasPermission("attendances.create");
  const canUpdateAttendance = hasPermission("attendances.update");
  const canReadEmployees = hasPermission("employees.read");

  const [
    params,
    setParams,
  ] =
    useState<AttendanceQueryParams>(
      DEFAULT_PARAMS,
    );

  const attendances = useAttendances(
    params,
    canReadAttendances,
  );

  const employees = useEmployees(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canReadAttendances &&
      canReadEmployees,
  );

  const data =
    attendances.data?.data ?? [];

  const meta =
    attendances.data?.meta;

  if (!canReadAttendances) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view attendances.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account does not have the required access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Attendance
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage employee attendance records.
          </p>
        </div>

        {canCreateAttendance && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push(
                "/attendances/new",
              )
            }
          >
            Add Attendance
          </Button>
        )}
      </div>

      <AttendanceToolbar
        params={params}
        employees={
          employees.data?.data ?? []
        }
        onChange={setParams}
      />

      {attendances.isLoading ||
      (canReadEmployees &&
        employees.isLoading) ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : attendances.error ||
        (canReadEmployees &&
          employees.error) ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load attendance.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "attendance record"
                : "attendance records"}
            </p>
          </div>

          <AttendanceTable
            attendances={data}
            canUpdate={canUpdateAttendance}
            onView={(attendance) =>
              router.push(
                `/attendances/${attendance.id}`,
              )
            }
            onEdit={(attendance) =>
              router.push(
                `/attendances/${attendance.id}/edit`,
              )
            }
          />

          {meta && (
            <AttendancePagination
              page={meta.page}
              totalPages={
                meta.total_pages
              }
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(page) =>
                setParams(
                  (current) => ({
                    ...current,
                    page,
                  }),
                )
              }
            />
          )}
        </>
      )}
    </div>
  );
}