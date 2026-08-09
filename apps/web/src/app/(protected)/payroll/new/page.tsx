"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getEmployees } from "@/services/employee.service";
import {
  createPayroll,
  type CreatePayrollPayload,
} from "@/services/payroll.service";

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

export default function GeneratePayrollPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [employeeId, setEmployeeId] = useState("");
  const [bonus, setBonus] = useState("0");
  const [deduction, setDeduction] = useState("0");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [month, setMonth] = useState(
    String(currentMonth),
    );
    const [year, setYear] = useState(
    String(currentYear),
    );

  const { data, isLoading } = useQuery({
    queryKey: ["employees", "payroll-form"],
    queryFn: () =>
      getEmployees({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      }),
  });

  const employees = data?.data ?? [];

  const selectedEmployee = employees.find(
    (employee) => employee.id === employeeId,
  );

  const baseSalary =
    selectedEmployee?.salary ?? 0;

  const bonusValue = Math.max(
    0,
    Number(bonus) || 0,
  );

  const deductionValue = Math.max(
    0,
    Number(deduction) || 0,
  );

  const totalSalary =
    baseSalary +
    bonusValue -
    deductionValue;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    if (totalSalary < 0) {
      toast.error(
        "Deduction cannot exceed the salary",
      );
      return;
    }

    const payload: CreatePayrollPayload = {
      employeeId,
      month: Number(month),
      year: Number(year),
      bonus: bonusValue,
      deduction: deductionValue,
    };

    try {
      setIsSubmitting(true);

      await createPayroll(payload);

      await queryClient.invalidateQueries({
        queryKey: ["payrolls"],
      });

      toast.success(
        "Payroll generated successfully",
      );

      router.push("/payroll");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to generate payroll";

        toast.error(message);
      } else {
        toast.error(
          "Failed to generate payroll",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/payroll"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payroll
        </Link>

        <h1 className="text-2xl font-semibold">
          Generate Payroll
        </h1>

        <p className="text-sm text-muted-foreground">
          Generate payroll for an employee.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            Payroll Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Employee
              </label>

              <select
                value={employeeId}
                onChange={(event) =>
                  setEmployeeId(
                    event.target.value,
                  )
                }
                disabled={isLoading || isSubmitting}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                required
              >
                <option value="">
                  {isLoading
                    ? "Loading employees..."
                    : "Select employee"}
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} —{" "}
                    {employee.department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Month
                </label>

                <select
                  value={month}
                  onChange={(event) =>
                    setMonth(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {months.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Year
                </label>

                <select
                  value={year}
                  onChange={(event) =>
                    setYear(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="2026">
                    2026
                  </option>
                  <option value="2027">
                    2027
                  </option>
                  <option value="2028">
                    2028
                  </option>
                  <option value="2029">
                    2029
                  </option>
                  <option value="2030">
                    2030
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Base Salary
              </label>

              <Input
                value={
                  baseSalary.toLocaleString(
                    "id-ID",
                  )
                }
                readOnly
                disabled
              />

              <p className="text-xs text-muted-foreground">
                Base salary is taken from the
                employee&apos;s current salary.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Bonus
                </label>

                <Input
                  type="number"
                  min="0"
                  value={bonus}
                  onChange={(event) =>
                    setBonus(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Deduction
                </label>

                <Input
                  type="number"
                  min="0"
                  value={deduction}
                  onChange={(event) =>
                    setDeduction(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Salary
                </span>

                <span className="text-lg font-semibold">
                  Rp{" "}
                  {totalSalary.toLocaleString(
                    "id-ID",
                  )}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Base Salary + Bonus − Deduction
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/payroll">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isLoading ||
                  !employeeId ||
                  totalSalary < 0
                }
              >
                {isSubmitting
                  ? "Generating..."
                  : "Generate Payroll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}