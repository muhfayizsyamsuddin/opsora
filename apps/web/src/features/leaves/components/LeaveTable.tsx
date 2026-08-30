"use client";

import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Leave,
} from "@/features/leaves/types/leave";

type LeaveTableProps = {
  leaves: Leave[];
  canUpdate: boolean;
  onView: (leave: Leave) => void;
  onEdit: (leave: Leave) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getStatusStyle(
  status: Leave["status"],
) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "APPROVED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "REJECTED":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    case "CANCELLED":
      return "border-muted bg-muted text-muted-foreground";

    default:
      return "border-muted bg-muted text-muted-foreground";
  }
}

export function LeaveTable({
  leaves,
  canUpdate,
  onView,
  onEdit,
}: LeaveTableProps) {
  if (leaves.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h3 className="text-sm font-semibold">
            No leave requests found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your filters or create a new leave request.
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
                Period
              </th>

              <th className="px-5 py-4">
                Reason
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
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {leave.employee.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {leave.employee.employeeCode}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {leave.employee.email}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium">
                    {formatDate(
                      leave.startDate,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    to{" "}
                    {formatDate(
                      leave.endDate,
                    )}
                  </p>
                </td>

                <td className="max-w-xs px-5 py-4">
                  <p className="truncate">
                    {leave.reason}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                      leave.status,
                    )}`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label={`View leave request for ${leave.employee.name}`}
                      onClick={() =>
                        onView(leave)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canUpdate &&
                      leave.status === "PENDING" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onEdit(leave)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}