"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SupplierForm } from "@/features/suppliers/components/SupplierForm";
import { useSupplier } from "@/features/suppliers/queries/use-supplier";
import { useUpdateSupplier } from "@/features/suppliers/mutations/use-update-supplier";
import { usePermissions } from "@/hooks/use-permissions";

type EditSupplierPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditSupplierPage({
  params,
}: EditSupplierPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const { hasPermission } = usePermissions();
  const canReadSupplier = hasPermission("suppliers.read");
  const canUpdateSupplier = hasPermission("suppliers.update");

  const supplier = useSupplier(
    id,
    canReadSupplier && canUpdateSupplier,
  );
  const updateSupplier = useUpdateSupplier();

  if (!canReadSupplier || !canUpdateSupplier) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit suppliers.
        </p>
      </div>
    );
  }

  if (supplier.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (supplier.error || !supplier.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load supplier.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          The supplier may no longer exist.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/suppliers")
          }
        >
          Back to Suppliers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Suppliers
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Supplier
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update {supplier.data.name}.
        </p>
      </div>

      <SupplierForm
        mode="edit"
        defaultValues={{
          name: supplier.data.name,
          phone: supplier.data.phone ?? "",
          email: supplier.data.email ?? "",
          address: supplier.data.address ?? "",
        }}
        isSubmittingEdit={
          updateSupplier.isPending
        }
        onSubmitEdit={(values) => {
          updateSupplier.mutate(
            {
              id,
              data: {
                name: values.name,
                phone: values.phone || null,
                email: values.email || null,
                address: values.address || null,
              },
            },
            {
              onSuccess: () => {
                router.replace("/suppliers");
              },
            },
          );
        }}
      />
    </div>
  );
}