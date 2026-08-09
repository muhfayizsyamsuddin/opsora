"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getEmployees } from "@/services/employee.service";

type EmployeeTableProps = {
  search?: string;
  department?: string;
  status?: "ACTIVE" | "INACTIVE" | "";
};

export function EmployeeTable({
  search = "",
  department = "",
  status = "",
}: EmployeeTableProps) {
  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    setPage(1);
  }, [search, department, status]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "employees",
      {
        page,
        search,
        department,
        status,
      },
    ],
    queryFn: () =>
      getEmployees({
        page,
        limit: pageSize,
        search: search || undefined,
        departmentId: department || undefined,
        status: status || undefined,
        sort: "createdAt",
        order: "desc",
      }),
  });

  const employees = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Loading employees...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load employees.
        </CardContent>
      </Card>
    );
  }

  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const startIndex =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endIndex =
    Math.min(page * pageSize, total);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm">
                <th className="px-6 py-4 font-medium">
                  Name
                </th>

                <th className="px-6 py-4 font-medium">
                  Email
                </th>

                <th className="px-6 py-4 font-medium">
                  Department
                </th>

                <th className="px-6 py-4 font-medium">
                  Position
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link
                      href={`/employees/${employee.id}`}
                      className="hover:underline"
                    >
                      {employee.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {employee.email}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {employee.department.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {employee.position}
                  </td>

                  <td className="px-6 py-4">
                    <span
                        className={
                            employee.status === "ACTIVE"
                            ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        }
                        >
                        {employee.status}
                    </span>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex}–{endIndex} of {total}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) => current - 1)
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
                  setPage((current) => current + 1)
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