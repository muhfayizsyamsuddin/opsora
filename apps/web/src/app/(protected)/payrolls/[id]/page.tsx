"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usePayroll } from "@/features/payrolls/queries/use-payroll";
import { useDeletePayroll } from "@/features/payrolls/mutations/use-delete-payroll";

import type { Payroll } from "@/features/payrolls/types/payroll";
import { usePermissions } from "@/hooks/use-permissions";

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();

  const { hasPermission } = usePermissions();
  const canReadPayroll = hasPermission("payroll.read");

  const id = String(params.id);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const payroll = usePayroll(id);
  const deletePayroll = useDeletePayroll();

  const data: Payroll | undefined =
    payroll.data;

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
      month: "long",
      year: "numeric",
    }).format(
      new Date(year, month - 1, 1),
    );

  const handleDelete = () => {
    if (!data) {
      return;
    }

    deletePayroll.mutate(data.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        router.push("/payrolls");
      },
    });
  };

  if (payroll.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (payroll.error || !data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load payroll.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          The payroll record may not exist or could
          not be loaded.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/payrolls")
          }
        >
          Back to Payrolls
        </Button>
      </div>
    );
  }

  if (!canReadPayroll) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this payroll.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Payroll Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Payroll information for{" "}
            {data.employee.name}.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/payrolls")
            }
          >
            Back
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            onClick={() =>
              setDeleteOpen(true)
            }
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Employee */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold">
          Employee Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Employee
            </p>

            <p className="mt-1 font-medium">
              {data.employee.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Employee Code
            </p>

            <p className="mt-1 font-medium">
              {data.employee.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Department
            </p>

            <p className="mt-1 font-medium">
              {data.employee.department.name}
            </p>
          </div>
        </div>
      </section>

      {/* Payroll */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">
              Payroll Information
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatPeriod(
                data.month,
                data.year,
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">
              Base Salary
            </p>

            <p className="mt-2 font-semibold">
              {formatCurrency(
                data.baseSalary,
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">
              Bonus
            </p>

            <p className="mt-2 font-semibold">
              {formatCurrency(data.bonus)}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">
              Deduction
            </p>

            <p className="mt-2 font-semibold">
              {formatCurrency(
                data.deduction,
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground">
              Total Salary
            </p>

            <p className="mt-2 text-lg font-semibold">
              {formatCurrency(
                data.totalSalary,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Delete */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (
            !open &&
            !deletePayroll.isPending
          ) {
            setDeleteOpen(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete payroll?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete the
              payroll record for{" "}
              <span className="font-medium text-foreground">
                {data.employee.name}
              </span>{" "}
              for{" "}
              <span className="font-medium text-foreground">
                {formatPeriod(
                  data.month,
                  data.year,
                )}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                deletePayroll.isPending
              }
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                deletePayroll.isPending
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deletePayroll.isPending
                ? "Deleting..."
                : "Delete Payroll"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}