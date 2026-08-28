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
import { useDeleteCustomer } from "@/features/customers/mutations/use-delete-customer";
import { CustomerPagination } from "@/features/customers/components/CustomerPagination";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { CustomerToolbar } from "@/features/customers/components/CustomerToolbar";
import { useCustomers } from "@/features/customers/queries/use-customers";

import type {
  Customer,
  CustomerQueryParams,
} from "@/features/customers/types/customer";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: CustomerQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function CustomersPage() {
  const router = useRouter();
  const deleteCustomer = useDeleteCustomer();

  const { hasPermission } = usePermissions();
  const canReadCustomer = hasPermission("customers.read");
  const canCreateCustomer = hasPermission("customers.create");
  const canUpdateCustomer = hasPermission("customers.update");
  const canDeleteCustomer = hasPermission("customers.delete");

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const [params, setParams] =
    useState<CustomerQueryParams>(
      DEFAULT_PARAMS,
    );

  const customers = useCustomers(
    params,
    canReadCustomer,
  );

  const customerData =
    customers.data?.data ?? [];

  const meta = customers.data?.meta;

  if (!canReadCustomer) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view customers.
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
            Customers
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage customer information and contacts.
          </p>
        </div>

        {canCreateCustomer && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/customers/new")
            }
          >
            Add Customer
          </Button>
        )}
      </div>

      <CustomerToolbar
        params={params}
        onChange={setParams}
      />

      {customers.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : customers.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load customers.
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
                ? "customer"
                : "customers"}
            </p>
          </div>

          <CustomerTable
            customers={customerData}
            canUpdate={canUpdateCustomer}
            canDelete={canDeleteCustomer}
            onView={(customer) =>
              router.push(
                `/customers/${customer.id}`,
              )
            }
            onEdit={(customer) =>
              router.push(
                `/customers/${customer.id}/edit`,
              )
            }
            onDelete={(customer) =>
              setCustomerToDelete(customer)
            }
          />

          {meta && (
            <CustomerPagination
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
        open={Boolean(customerToDelete)}
        onOpenChange={(open) => {
            if (!open) {
            setCustomerToDelete(null);
            }
        }}
        >
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                Delete customer?
            </AlertDialogTitle>

            <AlertDialogDescription>
                {customerToDelete
                ? `This will remove ${customerToDelete.name} from the active customer list.`
                : "This customer will be removed from the active customer list."}
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
                onClick={(event) => {
                event.preventDefault();

                if (!customerToDelete) {
                    return;
                }

                deleteCustomer.mutate(
                    customerToDelete.id,
                    {
                    onSuccess: () => {
                        setCustomerToDelete(null);
                    },
                    },
                );
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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