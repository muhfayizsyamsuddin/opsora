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
  Trash2,
  UserRound,
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

import { useCustomer } from "@/features/customers/queries/use-customer";
import { useDeleteCustomer } from "@/features/customers/mutations/use-delete-customer";
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

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const { hasPermission } = usePermissions();
  const canReadCustomer = hasPermission("customers.read");
  const canUpdate = hasPermission("customers.update");
  const canDelete = hasPermission("customers.delete");
    
  const customer = useCustomer(
    id,
    canReadCustomer,
  );
  const deleteCustomer = useDeleteCustomer();
  
  if (!canReadCustomer) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this customer.
        </p>
      </div>
    );
  }

  if (customer.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />

        <div className="min-h-64 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    customer.error ||
    !customer.data
  ) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push("/customers")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load customer.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The customer may not exist or something went wrong.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              customer.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = customer.data;

  const handleDelete = () => {
    deleteCustomer.mutate(
      data.id,
      {
        onSuccess: () => {
          router.push(
            "/customers",
          );
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
              router.push(
                "/customers",
              )
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>

          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Customer Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View customer information and contact details.
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
                  `/customers/${data.id}/edit`,
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          )}

          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleteCustomer.isPending}
              onClick={() =>
                setShowDeleteDialog(true)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {deleteCustomer.isPending
                ? "Deleting..."
                : "Delete Customer"}
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Customer Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Basic information about this customer.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />

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
                {formatDate(
                  data.createdAt,
                )}
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
                {formatDate(
                  data.updatedAt,
                )}
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
            !deleteCustomer.isPending
          ) {
            setShowDeleteDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete customer?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {data.name}
              </span>{" "}
              from the active customer list.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteCustomer.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteCustomer.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteCustomer.isPending
                ? "Deleting..."
                : "Delete Customer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}