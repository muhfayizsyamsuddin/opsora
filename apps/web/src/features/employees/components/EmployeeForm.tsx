"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateEmployee } from "@/features/employees/mutations/use-create-employee";
import { useUpdateEmployee } from "@/features/employees/mutations/use-update-employee";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "@/features/employees/schemas/employee-form.schema";

import type { Department } from "@/features/departments/types/department";
import type { Employee } from "@/features/employees/types/employee";

type EmployeeFormProps = {
  departments: Department[];
  employee?: Employee;
};

export function EmployeeForm({
  departments,
  employee,
}: EmployeeFormProps) {
  const router = useRouter();

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const isEditMode = Boolean(employee);

  const isPending = createEmployee.isPending || updateEmployee.isPending;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(
      employeeFormSchema,
    ),
    defaultValues: {
      name: employee?.name ?? "",
      email: employee?.email ?? "",
      position: employee?.position ?? "",
      salary: employee
        ? Number(employee.salary)
        : 0,
      hireDate: employee?.hireDate
        ? employee.hireDate.slice(0, 10)
        : "",
      departmentId:
        employee?.departmentId ?? "",
      status: employee?.status ?? "ACTIVE",
    },
  });

  useEffect(() => {
    if (!employee) {
      return;
    }

    reset({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      salary: Number(employee.salary),
      hireDate:
        employee.hireDate.slice(0, 10),
      departmentId:
        employee.departmentId,
      status: employee.status,
    });
  }, [employee, reset]);

  const onSubmit = (
    values: EmployeeFormValues,
  ) => {
    if (employee) {
      updateEmployee.mutate(
        {
          id: employee.id,
          data: {
            name: values.name,
            email: values.email,
            position: values.position,
            salary: values.salary,
            hireDate: values.hireDate,
            departmentId:
              values.departmentId,
            status: values.status,
          },
        },
        {
          onSuccess: () => {
            router.replace(
              `/employees/${employee.id}`,
            );
          },
        },
      );
      return;
    }
    createEmployee.mutate(
      {
        name: values.name,
        email: values.email,
        position: values.position,
        salary: values.salary,
        hireDate: values.hireDate,
        departmentId:
          values.departmentId,
      },
      {
        onSuccess: () => {
          router.replace("/employees");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            People Operations
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Employee Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update employee information and organizational assignment."
              : "Create a new employee record and assign a department."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Employee Name"
            error={errors.name?.message}
          >
            <Input
              {...register("name")}
              placeholder="e.g. John Doe"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="Email"
            error={errors.email?.message}
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="Position"
            error={errors.position?.message}
          >
            <Input
              {...register("position")}
              placeholder="e.g. Software Engineer"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="Salary"
            error={errors.salary?.message}
          >
            <Input
              {...register("salary", {
                valueAsNumber: true,
              })}
              type="number"
              min="0"
              step="1"
              placeholder="5000000"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="Hire Date"
            error={errors.hireDate?.message}
          >
            <Input
              {...register("hireDate")}
              type="date"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="Department"
            error={
              errors.departmentId?.message
            }
          >
            <select
              {...register("departmentId")}
              disabled={isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Select department
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ),
              )}
            </select>
          </Field>
          {isEditMode && (
            <Field
              label="Status"
              error={errors.status?.message}
            >
              <select
                {...register("status")}
                  disabled={isPending}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
              >
                <option value="ACTIVE">
                  Active
                </option>
                <option value="INACTIVE">
                  Inactive
                </option>
              </select>
            </Field>
            )}
        </div>
      </section>

      <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
        {isEditMode
          ? `Employee code: ${employee?.employeeCode}`
          : "Employee code will be generated automatically after the employee is created."}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={isPending}
          onClick={() =>
            router.push(
              employee
                ? `/employees/${employee.id}`
                : "/employees",
            )
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={isPending}
        >
          {isPending
            ? isEditMode
            ? "Updating..."
            : "Saving..."
            : isEditMode
            ? "Update Employee"
            : "Save Employee"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {children}

      {error && (
        <p className="text-xs leading-5 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}