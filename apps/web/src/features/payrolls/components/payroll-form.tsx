"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEmployees } from "@/features/employees/queries/use-employees";
import { useCreatePayroll } from "@/features/payrolls/mutations/use-create-payroll";

import {
  payrollFormSchema,
  type PayrollFormValues,
} from "@/features/payrolls/schemas/payroll-form.schema";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function PayrollForm() {
  const router = useRouter();

  const createPayroll = useCreatePayroll();

  const employees = useEmployees({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayrollFormValues>({
    resolver: zodResolver(
      payrollFormSchema,
    ),
    defaultValues: {
      employeeId: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      bonus: 0,
      deduction: 0,
    },
  });

  const onSubmit = (
    values: PayrollFormValues,
  ) => {
    createPayroll.mutate(values, {
      onSuccess: () => {
        router.push("/payrolls");
      },
    });
  };

  const employeeList =
    employees.data?.data ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold">
            Payroll Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Generate a payroll record for an employee.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Employee */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Employee
            </label>

            <select
              {...register("employeeId")}
              disabled={employees.isLoading}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {employees.isLoading
                  ? "Loading employees..."
                  : "Select employee"}
              </option>

              {employeeList.map(
                (employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} —{" "}
                    {employee.employeeCode}
                  </option>
                ),
              )}
            </select>

            {errors.employeeId && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          {/* Month */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Month
            </label>

            <select
              {...register("month", {
                valueAsNumber: true,
              })}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              {MONTHS.map(
                (month, index) => (
                  <option
                    key={month}
                    value={index + 1}
                  >
                    {month}
                  </option>
                ),
              )}
            </select>

            {errors.month && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.month.message}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Year
            </label>

            <Input
              type="number"
              min={2000}
              max={3000}
              {...register("year", {
                valueAsNumber: true,
              })}
              className="h-10 rounded-xl"
            />

            {errors.year && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.year.message}
              </p>
            )}
          </div>

          {/* Bonus */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Bonus
            </label>

            <Input
              type="number"
              min={0}
              step="1"
              {...register("bonus", {
                valueAsNumber: true,
              })}
              className="h-10 rounded-xl"
            />

            {errors.bonus && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.bonus.message}
              </p>
            )}
          </div>

          {/* Deduction */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Deduction
            </label>

            <Input
              type="number"
              min={0}
              step="1"
              {...register("deduction", {
                valueAsNumber: true,
              })}
              className="h-10 rounded-xl"
            />

            {errors.deduction && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.deduction.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {createPayroll.error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Unable to create payroll.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {createPayroll.error instanceof Error
              ? createPayroll.error.message
              : "Please try again."}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={createPayroll.isPending}
          onClick={() =>
            router.push("/payrolls")
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={
            createPayroll.isPending ||
            employees.isLoading
          }
        >
          {createPayroll.isPending
            ? "Creating..."
            : "Create Payroll"}
        </Button>
      </div>
    </form>
  );
}