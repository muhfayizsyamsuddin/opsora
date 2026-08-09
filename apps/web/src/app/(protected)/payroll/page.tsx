"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getPayrolls } from "@/services/payroll.service";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function PayrollPage() {
  const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState(
        String(new Date().getFullYear()),
    );
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] =
        useState("");

  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, month, year]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "payrolls",
      {
        page,
        search: debouncedSearch,
        month,
        year,
      },
    ],
    queryFn: () =>
      getPayrolls({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        month: month
          ? Number(month)
          : undefined,
        year: year
          ? Number(year)
          : undefined,
        sort: "createdAt",
        order: "desc",
      }),
  });

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 5 },
    (_, index) => currentYear - 2 + index,
  );

  const payrolls = data?.data ?? [];
  const meta = data?.meta;

  const total = meta?.total ?? 0;
  const totalPages =
    meta?.totalPages ?? 1;

  const startIndex =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endIndex = Math.min(
    page * pageSize,
    total,
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Payroll
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage employee payroll.
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading payrolls...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Payroll
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage employee payroll.
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">
              Failed to load payrolls.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Payroll
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage employee payroll.
          </p>
        </div>

        <Link
          href="/payroll/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          Generate Payroll
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employees..."
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <select
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="">
                All Months
              </option>

              {months.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                {years.map((item) => (
                    <option key={item} value={item}>
                    {item}
                    </option>
                ))}
            </select>
          </div>
        </CardContent>
      </Card>

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
                    Period
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Base Salary
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Bonus
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Deduction
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Total Salary
                  </th>
                </tr>
              </thead>

              <tbody>
                {payrolls.map((payroll) => (
                  <tr
                    key={payroll.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/payroll/${payroll.id}`}
                        className="hover:underline"
                      >
                        {payroll.employee.name}
                      </Link>

                      <p className="text-xs text-muted-foreground">
                        {payroll.employee.department.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {
                        months.find(
                          (item) =>
                            item.value ===
                            payroll.month,
                        )?.label
                      }{" "}
                      {payroll.year}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      Rp{" "}
                      {payroll.baseSalary.toLocaleString(
                        "id-ID",
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      Rp{" "}
                      {payroll.bonus.toLocaleString(
                        "id-ID",
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      Rp{" "}
                      {payroll.deduction.toLocaleString(
                        "id-ID",
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      Rp{" "}
                      {payroll.totalSalary.toLocaleString(
                        "id-ID",
                      )}
                    </td>
                  </tr>
                ))}

                {payrolls.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      No payroll records found.
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
                  disabled={
                    page >= totalPages
                  }
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
    </div>
  );
}