"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getDepartments } from "@/services/department.service";

type DepartmentTableProps = {
  search?: string;
};

export function DepartmentTable({
  search = "",
}: DepartmentTableProps) {
  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "departments",
      {
        page,
        search,
      },
    ],
    queryFn: () =>
      getDepartments({
        page,
        limit: pageSize,
        search: search || undefined,
        sort: "createdAt",
        order: "desc",
      }),
  });

  const departments = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Loading departments...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-destructive">
            Failed to load departments.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const startIndex =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endIndex = Math.min(page * pageSize, total);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left font-medium">
                  Name
                </th>
              </tr>
            </thead>

            <tbody>
              {departments.map((department) => (
                <tr
                  key={department.id}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link
                        href={`/departments/${department.id}`}
                        className="hover:underline"
                    >
                        {department.name}
                    </Link>
                  </td>
                </tr>
              ))}

              {departments.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No departments found.
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