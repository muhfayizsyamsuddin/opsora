"use client";

import {
  Eye,
  Trash2,
} from "lucide-react";

import type { Payroll } from "@/features/payrolls/types/payroll";
import { Button } from "@/components/ui/button";

type PayrollTableProps = {
  payrolls: Payroll[];
  canDelete: boolean;
  onView: (payroll: Payroll) => void;
  onDelete: (payroll: Payroll) => void;
};

export function PayrollTable({
  payrolls,
  canDelete,
  onView,
  onDelete,
}: PayrollTableProps) {
  const formatCurrency = (
    value: number | string,
  ) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));

  const formatPeriod = (
    month: number,
    year: number,
  ) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(
      new Date(year, month - 1, 1),
    );

  if (payrolls.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="font-medium">
          No payroll records found.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-5 py-4 text-left font-medium">
                Employee
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Period
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Base Salary
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Bonus
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Deduction
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Total Salary
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium">
                      {payroll.employee.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {payroll.employee.employeeCode}
                    </p>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {formatPeriod(
                    payroll.month,
                    payroll.year,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right">
                  {formatCurrency(
                    payroll.baseSalary,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right">
                  {formatCurrency(
                    payroll.bonus,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right">
                  {formatCurrency(
                    payroll.deduction,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                  {formatCurrency(
                    payroll.totalSalary,
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`View payroll for ${payroll.employee.name}`}
                      title="View payroll"
                      onClick={() =>
                        onView(payroll)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {canDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg text-destructive hover:text-destructive"
                        onClick={() =>
                          onDelete(payroll)
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
    </div>
  );
}