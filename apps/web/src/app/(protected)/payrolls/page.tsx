"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

import { useEmployees } from "@/features/employees/queries/use-employees";

import { usePayrolls } from "@/features/payrolls/queries/use-payrolls";
import { useDeletePayroll } from "@/features/payrolls/mutations/use-delete-payroll";

import { PayrollToolbar } from "@/features/payrolls/components/payroll-toolbar";
import { PayrollTable } from "@/features/payrolls/components/payroll-table";
import { PayrollPagination } from "@/features/payrolls/components/payroll-pagination";
import type {
  Payroll,
  PayrollQueryParams,
} from "@/features/payrolls/types/payroll";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: PayrollQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function PayrollsPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadPayrolls = hasPermission("payroll.read");
  const canCreatePayroll = hasPermission("payroll.create");
  const canDeletePayroll = hasPermission("payroll.delete");
  const canReadEmployees = hasPermission("employees.read");

  const [params, setParams] =
    useState<PayrollQueryParams>(
      DEFAULT_PARAMS,
    );

  const [deleteTarget, setDeleteTarget] =
    useState<Payroll | null>(null);

  const payrolls = usePayrolls(
    params,
    canReadPayrolls,
  );

  const employees = useEmployees(
    {
      page: 1,
      per_page: 100,
      status: "ACTIVE",
    },
    canReadPayrolls &&
      canReadEmployees,
  );

  const deletePayroll = useDeletePayroll();

  const data =
    payrolls.data?.data ?? [];

  const meta =
    payrolls.data?.meta;
  
  if (!canReadPayrolls) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view payrolls.
        </p>
      </div>
    );
  }

  const isLoading =
    payrolls.isLoading ||
    (canReadEmployees && employees.isLoading);

  const isError =
    payrolls.isError ||
    (canReadEmployees && employees.isError);

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deletePayroll.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Payrolls
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage employee payroll records and salary payments.
          </p>
        </div>

        {canCreatePayroll && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/payrolls/new")
            }
          >
            Create Payroll
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <PayrollToolbar
        params={params}
        employees={
          employees.data?.data ?? []
        }
        onChange={setParams}
      />

      {/* Content */}
      {isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : isError? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load payrolls.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => {
              payrolls.refetch();
              if (canReadEmployees) {
                employees.refetch();
              }
            }}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "payroll"
                : "payrolls"}
            </p>
          </div>

          <PayrollTable
            payrolls={data}
            canDelete={canDeletePayroll}
            onView={(payroll) =>
              router.push(
                `/payrolls/${payroll.id}`,
              )
            }
            onDelete={(payroll) =>
              setDeleteTarget(payroll)
            }
          />

          {meta &&
            meta.total_pages > 0 && (
              <PayrollPagination
                page={meta.page}
                totalPages={meta.total_pages}
                total={meta.total}
                perPage={meta.per_page}
                onPageChange={(page: number) =>
                  setParams((current) => ({
                    ...current,
                    page,
                  }))
                }
              />
            )}
        </>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deletePayroll.isPending) {
            setDeleteTarget(null);
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
                {deleteTarget?.employee.name}
              </span>{" "}
              for{" "}
              <span className="font-medium text-foreground">
                {deleteTarget
                  ? `${deleteTarget.month}/${deleteTarget.year}`
                  : ""}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deletePayroll.isPending}
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deletePayroll.isPending}
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