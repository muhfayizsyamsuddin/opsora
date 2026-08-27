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
import { DepartmentPagination } from "@/features/departments/components/DepartmentPagination";
import { DepartmentTable } from "@/features/departments/components/DepartmentTable";
import { DepartmentToolbar } from "@/features/departments/components/DepartmentToolbar";
import { useDepartments } from "@/features/departments/queries/use-departments";

import type {
  DepartmentQueryParams,
  Department,
} from "@/features/departments/types/department";
import { useDeleteDepartment } from "@/features/departments/mutations/use-delete-department";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: DepartmentQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function DepartmentsPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadDepartments = hasPermission("departments.read");
  const canCreateDepartment = hasPermission("departments.create");
  const canUpdateDepartment = hasPermission("departments.update");
  const canDeleteDepartment = hasPermission("departments.delete");

  const [deleteTarget, setDeleteTarget] =
    useState<Department | null>(null);

  const deleteDepartment =
    useDeleteDepartment();

  const [params, setParams] =
    useState<DepartmentQueryParams>(
      DEFAULT_PARAMS,
    );

  const departments =
    useDepartments(params);

  const data =
    departments.data?.data ?? [];

  const meta =
    departments.data?.meta;

  if (!canReadDepartments) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view departments.
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
            Departments
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Organize employees into departments.
          </p>
        </div>

        {canCreateDepartment && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/departments/new")
            }
          >
            Add Department
          </Button>
        )}
      </div>

      <DepartmentToolbar
        params={params}
        onChange={setParams}
      />

      {departments.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : departments.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load departments.
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
                ? "department"
                : "departments"}
            </p>
          </div>

          <DepartmentTable
            departments={data}
            canUpdate={canUpdateDepartment}
            canDelete={canDeleteDepartment}
            onView={(department) =>
              router.push(
                `/departments/${department.id}`,
              )
            }
            onEdit={(department) =>
              router.push(
                `/departments/${department.id}/edit`,
              )
            }
            onDelete={(department) =>
              setDeleteTarget(department)
            }
          />

          {meta && (
            <DepartmentPagination
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
            !deleteDepartment.isPending
          ) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete department?
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
              disabled={deleteDepartment.isPending}
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteDepartment.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) {
                    return;
                }

                deleteDepartment.mutate(
                    deleteTarget.id,
                    {
                    onSuccess: () => {
                        setDeleteTarget(null);
                    },
                    },
                );
                }}
            >
                {deleteDepartment.isPending
                ? "Deleting..."
                : "Delete Department"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}