"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/features/customers/components/CustomerForm";
import { useCustomer } from "@/features/customers/queries/use-customer";
import { useUpdateCustomer } from "@/features/customers/mutations/use-update-customer";
import { usePermissions } from "@/hooks/use-permissions";

type EditCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canUpdateCustomer = hasPermission("customers.update");

  const customer = useCustomer(id);
  const updateCustomer = useUpdateCustomer();

  if (customer.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (customer.error || !customer.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load customer.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          The customer may no longer exist.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/customers")
          }
        >
          Back to Customers
        </Button>
      </div>
    );
  }

  if (!canUpdateCustomer) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit customers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Customers
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Customer
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update {customer.data.name}.
        </p>
      </div>

      <CustomerForm
        mode="edit"
        defaultValues={{
          name: customer.data.name,
          phone: customer.data.phone ?? "",
          email: customer.data.email ?? "",
          address: customer.data.address ?? "",
        }}
        isSubmittingEdit={
          updateCustomer.isPending
        }
        onSubmitEdit={(values) => {
          updateCustomer.mutate(
            {
              id,
              data: {
                name: values.name,
                phone: values.phone || undefined,
                email: values.email || undefined,
                address: values.address || undefined,
              },
            },
            {
              onSuccess: () => {
                router.replace("/customers");
              },
            },
          );
        }}
      />
    </div>
  );
}