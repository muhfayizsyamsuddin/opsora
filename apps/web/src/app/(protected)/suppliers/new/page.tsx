"use client";

import { SupplierForm } from "@/features/suppliers/components/SupplierForm";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewSupplierPage() {
  const { hasPermission } = usePermissions();
  const canCreateSupplier = hasPermission("suppliers.create");

  if (!canCreateSupplier) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create suppliers.
        </p>
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
          Add Supplier
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new supplier record.
        </p>
      </div>

      <SupplierForm />
    </div>
  );
}