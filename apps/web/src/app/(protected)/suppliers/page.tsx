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
import { useDeleteSupplier } from "@/features/suppliers/mutations/use-delete-supplier";
import { SupplierPagination } from "@/features/suppliers/components/SupplierPagination";
import { SupplierTable } from "@/features/suppliers/components/SupplierTable";
import { SupplierToolbar } from "@/features/suppliers/components/SupplierToolbar";
import { useSuppliers } from "@/features/suppliers/queries/use-suppliers";

import type {
  Supplier,
  SupplierQueryParams,
} from "@/features/suppliers/types/supplier";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: SupplierQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function SuppliersPage() {
  const router = useRouter();
  const deleteSupplier = useDeleteSupplier();

  const { hasPermission } = usePermissions();
  const canReadSuppliers = hasPermission("suppliers.read");
  const canCreateSupplier = hasPermission("suppliers.create");
  const canUpdateSupplier = hasPermission("suppliers.update");
  const canDeleteSupplier = hasPermission("suppliers.delete");

  const [supplierToDelete, setSupplierToDelete] =
    useState<Supplier | null>(null);

  const [params, setParams] =
    useState<SupplierQueryParams>(
      DEFAULT_PARAMS,
    );

  const suppliers = useSuppliers(
    params,
    canReadSuppliers,
  );

  const supplierData =
    suppliers.data?.data ?? [];

  const meta = suppliers.data?.meta;

  if (!canReadSuppliers) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view suppliers.
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
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Suppliers
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage supplier information and contacts.
          </p>
        </div>

        {canCreateSupplier && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/suppliers/new")
            }
          >
            Add Supplier
          </Button>
        )}
      </div>

      <SupplierToolbar
        params={params}
        onChange={setParams}
      />

      {suppliers.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : suppliers.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load suppliers.
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
                ? "supplier"
                : "suppliers"}
            </p>
          </div>

          <SupplierTable
            suppliers={supplierData}
            canUpdate={canUpdateSupplier}
            canDelete={canDeleteSupplier}
            onView={(supplier) =>
              router.push(
                `/suppliers/${supplier.id}`,
              )
            }
            onEdit={(supplier) =>
              router.push(
                `/suppliers/${supplier.id}/edit`,
              )
            }
            onDelete={(supplier) =>
              setSupplierToDelete(supplier)
            }
          />

          {meta && (
            <SupplierPagination
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
        open={Boolean(supplierToDelete)}
        onOpenChange={(open) => {
            if (!open) {
            setSupplierToDelete(null);
            }
        }}
        >
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                Delete supplier?
            </AlertDialogTitle>

            <AlertDialogDescription>
                {supplierToDelete
                ? `This will remove ${supplierToDelete.name} from the active supplier list.`
                : "This supplier will be removed from the active supplier list."}
            </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
            <AlertDialogCancel
                disabled={deleteSupplier.isPending}
            >
                Cancel
            </AlertDialogCancel>

            <AlertDialogAction
                disabled={deleteSupplier.isPending}
                onClick={(event) => {
                event.preventDefault();

                if (!supplierToDelete) {
                    return;
                }

                deleteSupplier.mutate(
                    supplierToDelete.id,
                    {
                    onSuccess: () => {
                        setSupplierToDelete(null);
                    },
                    },
                );
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
                {deleteSupplier.isPending
                ? "Deleting..."
                : "Delete Supplier"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}