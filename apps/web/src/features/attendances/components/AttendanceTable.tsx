"use client";

import {
  Eye,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Attendance,
} from "@/features/attendances/types/attendance";

type AttendanceTableProps = {
  attendances: Attendance[];
  canUpdate: boolean;
  onView: (
    attendance: Attendance,
  ) => void;
  onEdit: (
    attendance: Attendance,
  ) => void;
};

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

function getStatusStyle(
  status: Attendance["status"],
) {
  switch (status) {
    case "PRESENT":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "LATE":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "ABSENT":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    case "LEAVE":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    default:
      return "border-muted bg-muted text-muted-foreground";
  }
}

export function AttendanceTable({
  attendances,
  canUpdate,
  onView,
  onEdit,
}: AttendanceTableProps) {
  if (attendances.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h3 className="text-sm font-semibold">
            No attendance found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your filters or create a new attendance record.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Employee
              </th>

              <th className="px-5 py-4">
                Department
              </th>

              <th className="px-5 py-4">
                Check In
              </th>

              <th className="px-5 py-4">
                Check Out
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {attendances.map(
              (attendance) => (
                <tr
                  key={attendance.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {
                        attendance.employee
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        attendance.employee
                          .employeeCode
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        attendance.employee
                          .email
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {
                      attendance.employee
                        .department.name
                    }
                  </td>

                  <td className="px-5 py-4">
                    {formatDateTime(
                      attendance.checkIn,
                    )}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDateTime(
                      attendance.checkOut,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                        attendance.status,
                      )}`}
                    >
                      {attendance.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        onClick={() =>
                          onView(
                            attendance,
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {canUpdate && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-lg"
                          onClick={() =>
                            onEdit(attendance)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}