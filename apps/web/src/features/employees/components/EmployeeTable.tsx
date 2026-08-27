"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Employee,
} from "@/features/employees/types/employee";

type EmployeeTableProps = {
  employees: Employee[];
  canUpdate: boolean;
  canDelete: boolean;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

function formatCurrency(
  value: string | number,
) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getStatusStyle(
  status: Employee["status"],
) {
  if (status === "ACTIVE") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  return "border-muted bg-muted text-muted-foreground";
}

export function EmployeeTable({
  employees,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h3 className="text-sm font-semibold">
            No employees found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your filters or create a new employee.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Employee
              </th>

              <th className="px-5 py-4">
                Position
              </th>

              <th className="px-5 py-4">
                Department
              </th>

              <th className="px-5 py-4">
                Salary
              </th>

              <th className="px-5 py-4">
                Hire Date
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
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {employee.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {employee.employeeCode}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {employee.email}
                  </p>
                </td>

                <td className="px-5 py-4">
                  {employee.position}
                </td>

                <td className="px-5 py-4">
                  {employee.department.name}
                </td>

                <td className="px-5 py-4 font-medium">
                  {formatCurrency(
                    employee.salary,
                  )}
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(
                    employee.hireDate,
                  )}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                      employee.status,
                    )}`}
                  >
                    {employee.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label={`View ${employee.name}`}
                      onClick={() =>
                        onView(employee)
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
                        aria-label={`Edit ${employee.name}`}
                        onClick={() =>
                          onEdit(employee)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg text-destructive hover:text-destructive"
                        aria-label={`Delete ${employee.name}`}
                        onClick={() =>
                          onDelete(employee)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
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