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
import { useDeleteEmployee } from "@/features/employees/mutations/use-delete-employee";
import { EmployeePagination } from "@/features/employees/components/EmployeePagination";
import { EmployeeTable } from "@/features/employees/components/EmployeeTable";
import { EmployeeToolbar } from "@/features/employees/components/EmployeeToolbar";

import { useEmployees } from "@/features/employees/queries/use-employees";
import { useDepartments } from "@/features/departments/queries/use-departments";

import type {
  EmployeeQueryParams,
  Employee,
} from "@/features/employees/types/employee";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: EmployeeQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function EmployeesPage() {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const deleteEmployee = useDeleteEmployee();

  const { hasPermission } = usePermissions();
  const canReadEmployee = hasPermission("employees.read");
  const canCreateEmployee = hasPermission("employees.create");
  const canUpdateEmployee = hasPermission("employees.update");
  const canDeleteEmployee = hasPermission("employees.delete");

  const [params, setParams] =
    useState<EmployeeQueryParams>(
      DEFAULT_PARAMS,
    );

  const employees =
    useEmployees(params);

  const departments =
    useDepartments({
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    });

  const data =
    employees.data?.data ?? [];

  const meta =
    employees.data?.meta;

  if (!canReadEmployee) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view employees.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account does not have the required access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Employees
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage employee records and organizational assignments.
          </p>
        </div>

        {canCreateEmployee && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/employees/new")
            }
          >
            Add Employee
          </Button>
        )}
      </div>

      <EmployeeToolbar
        params={params}
        departments={
          departments.data?.data ?? []
        }
        onChange={setParams}
      />

      {employees.isLoading ||
      departments.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : employees.error ||
        departments.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load employees.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "employee"
                : "employees"}
            </p>
          </div>

          <EmployeeTable
            employees={data}
            canUpdate={canUpdateEmployee}
            canDelete={canDeleteEmployee}
            onView={(employee) =>
              router.push(
                `/employees/${employee.id}`,
              )
            }
            onEdit={(employee) =>
              router.push(
                `/employees/${employee.id}/edit`,
              )
            }
            onDelete={(employee) =>
              setDeleteTarget(employee)
            }
          />

          {meta && (
            <EmployeePagination
              page={meta.page}
              totalPages={meta.total_pages}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(page) =>
                setParams((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          )}
        </>
      )}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteEmployee.isPending
          ) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete employee?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
                . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteEmployee.isPending}
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteEmployee.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) {
                    return;
                }

                deleteEmployee.mutate(
                    deleteTarget.id,
                    {
                    onSuccess: () => {
                        setDeleteTarget(null);
                    },
                    },
                );
                }}
            >
                {deleteEmployee.isPending
                ? "Deleting..."
                : "Delete Employee"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}