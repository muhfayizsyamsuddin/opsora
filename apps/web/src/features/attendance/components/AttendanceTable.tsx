"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  getAttendances,
  updateAttendance,
  type AttendanceStatus,
} from "@/services/attendance.service";
import axios from "axios";
import { toast } from "sonner";

type AttendanceTableProps = {
  search?: string;
  employeeId?: string;
  status?: AttendanceStatus | "";
};

export function AttendanceTable({
  search = "",
  employeeId = "",
  status = "",
}: AttendanceTableProps) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [checkingOutId, setCheckingOutId] =
    useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [search, employeeId, status]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "attendances",
      {
        page,
        search,
        employeeId,
        status,
      },
    ],
    queryFn: () =>
      getAttendances({
        page,
        limit: pageSize,
        search: search || undefined,
        employeeId:
          employeeId || undefined,
        status: status || undefined,
        sort: "createdAt",
        order: "desc",
      }),
  });

  const attendances = data?.data ?? [];
  const meta = data?.meta;

  async function handleCheckOut(
    attendanceId: string,
  ) {
    try {
        setCheckingOutId(attendanceId);

        await updateAttendance(attendanceId, {
        checkOut: new Date().toISOString(),
        });

        toast.success("Employee checked out successfully");

        // Refresh attendance list
        await queryClient.invalidateQueries({
        queryKey: ["attendances"],
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ??
            "Failed to check out employee";

        toast.error(message);
        } else {
        toast.error("Failed to check out employee");
        }
    } finally {
        setCheckingOutId(null);
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Loading attendance...
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
            Failed to load attendance.
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
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-6 py-4 font-medium">
                  Employee
                </th>

                <th className="px-6 py-4 font-medium">
                  Department
                </th>

                <th className="px-6 py-4 font-medium">
                  Check In
                </th>

                <th className="px-6 py-4 font-medium">
                  Check Out
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>
                <th className="px-6 py-4 font-medium">
                    Action
                </th>
              </tr>
            </thead>

            <tbody>
              {attendances.map((attendance) => (
                <tr
                  key={attendance.id}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link
                      href={`/attendance/${attendance.id}`}
                      className="hover:underline"
                    >
                      {attendance.employee.name}
                    </Link>

                    <p className="text-xs text-muted-foreground">
                      {attendance.employee.email}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {attendance.employee.department.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(
                      attendance.checkIn,
                    ).toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {attendance.checkOut
                      ? new Date(
                          attendance.checkOut,
                        ).toLocaleString("id-ID")
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        attendance.status ===
                        "PRESENT"
                          ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                          : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {attendance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!attendance.checkOut &&
                    (attendance.status === "PRESENT" ||
                        attendance.status === "LATE") ? (
                        <button
                        type="button"
                        onClick={() =>
                            handleCheckOut(attendance.id)
                        }
                        disabled={
                            checkingOutId === attendance.id
                        }
                        className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                        >
                        {checkingOutId === attendance.id
                            ? "Checking Out..."
                            : "Check Out"}
                        </button>
                    ) : attendance.checkOut ? (
                        <span className="text-sm text-muted-foreground">
                        Completed
                        </span>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                        -
                        </span>
                    )}
                  </td>
                </tr>
              ))}

              {attendances.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No attendance records found.
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