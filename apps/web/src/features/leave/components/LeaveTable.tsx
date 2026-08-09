"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  getLeaves,
  type LeaveStatus,
} from "@/services/leave.service";

type LeaveTableProps = {
  search?: string;
  status?: LeaveStatus | "";
};

export function LeaveTable({
  search = "",
  status = "",
}: LeaveTableProps) {
  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "leaves",
      {
        page,
        search,
        status,
      },
    ],
    queryFn: () =>
      getLeaves({
        page,
        limit: pageSize,
        search: search || undefined,
        status: status || undefined,
        sort: "createdAt",
        order: "desc",
      }),
  });

  const leaves = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Loading leave requests...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load leave requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const startIndex =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endIndex = Math.min(
    page * pageSize,
    total,
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="px-6 py-4 font-medium">
                  Employee
                </th>

                <th className="px-6 py-4 font-medium">
                  Department
                </th>

                <th className="px-6 py-4 font-medium">
                  Start Date
                </th>

                <th className="px-6 py-4 font-medium">
                  End Date
                </th>

                <th className="px-6 py-4 font-medium">
                  Reason
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link
                      href={`/leave/${leave.id}`}
                      className="hover:underline"
                    >
                      {leave.employee.name}
                    </Link>

                    <p className="text-xs text-muted-foreground">
                      {leave.employee.email}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {leave.employee.department.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(
                      leave.startDate,
                    ).toLocaleDateString("id-ID")}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(
                      leave.endDate,
                    ).toLocaleDateString("id-ID")}
                  </td>

                  <td className="max-w-xs px-6 py-4 text-sm">
                    <p className="truncate">
                      {leave.reason}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        leave.status === "APPROVED"
                          ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                          : leave.status === "REJECTED"
                            ? "rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                            : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}

              {leaves.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex}–{endIndex} of{" "}
              {total}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (current) => current - 1,
                  )
                }
                className="rounded-md border px-3 py-2 text-sm disabled:pointer-events-none disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-2 text-sm">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage(
                    (current) => current + 1,
                  )
                }
                className="rounded-md border px-3 py-2 text-sm disabled:pointer-events-none disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}