"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Store,
  Trash2,
} from "lucide-react";

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

import { useSupplier } from "@/features/suppliers/queries/use-supplier";
import { useDeleteSupplier } from "@/features/suppliers/mutations/use-delete-supplier";
import { usePermissions } from "@/hooks/use-permissions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { hasPermission } = usePermissions();
  const canReadSupplier = hasPermission("suppliers.read");
  const canUpdate = hasPermission("suppliers.update");
  const canDelete = hasPermission("suppliers.delete");
  
  const supplier = useSupplier(
    id,
    canReadSupplier,
  );
  const deleteSupplier = useDeleteSupplier();


  if (!canReadSupplier) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this supplier.
        </p>
      </div>
    );
  }

  if (supplier.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />
        <div className="min-h-64 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    supplier.error ||
    !supplier.data
  ) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push("/suppliers")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Suppliers
        </Button>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load supplier.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The supplier may not exist or something went wrong.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              supplier.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = supplier.data;

  const handleDelete = () => {
    deleteSupplier.mutate(
      data.id,
      {
        onSuccess: () => {
          router.push("/suppliers");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3 rounded-xl"
            onClick={() =>
              router.push("/suppliers")
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Button>

          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Supplier Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View supplier information and contact details.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canUpdate && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                router.push(
                  `/suppliers/${data.id}/edit`,
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Supplier
            </Button>
          )}

          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleteSupplier.isPending}
              onClick={() =>
                setShowDeleteDialog(true)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {deleteSupplier.isPending
                ? "Deleting..."
                : "Delete Supplier"}
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Supplier Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Basic information about this supplier.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-semibold">
                {data.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium">
                {data.phone ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium">
                {data.email ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Address
              </p>

              <p className="mt-1 text-sm font-medium">
                {data.address ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Metadata
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(data.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(data.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteSupplier.isPending
          ) {
            setShowDeleteDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete supplier?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {data.name}
              </span>
              . This action cannot be undone.
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
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